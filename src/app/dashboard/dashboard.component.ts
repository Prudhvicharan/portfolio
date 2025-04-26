import { ViewportScroller } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
  inject,
  ViewChild,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import {
  Education,
  Project,
  WorkExperience,
  Category,
  UserData,
  ContactDetails,
} from './dashboard.model';
import {
  workExperiences,
  educationData,
  companyProjectsData,
  skillsData,
  userData,
  contactDetails,
} from './dashboard.data';

const SNACKBAR_DURATION = 3000;
const ZOOM_THRESHOLD = 175;
const SCROLL_DEBOUNCE = 50;
const INTERSECTION_OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '-72px 0px -50% 0px',
  threshold: [0, 0.25, 0.5, 0.75, 1.0],
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly elementRef = inject(ElementRef);

  private observer: IntersectionObserver | null = null;
  private visibleSections: Set<string> = new Set();
  private scrollTimeout: number | null = null;
  private animationObserver: IntersectionObserver | null = null;

  isDarkTheme = false;
  isScrolled = false;
  isResponsive = false;
  selectedProject: Project | null = null;
  workDetails = workExperiences[0].details || [];
  selectedCard = 0;
  contactForm!: FormGroup;
  showSidebarToggle = false;
  activeSection = 'dashboard';
  isLoading = false;
  currentYear = new Date().getFullYear();

  readonly workExperiences: ReadonlyArray<WorkExperience> = workExperiences;
  readonly educationData: ReadonlyArray<Education> = educationData;
  readonly companyProjectsData: ReadonlyArray<Project> = companyProjectsData;
  readonly skillsData: ReadonlyArray<Category> = skillsData;
  readonly userData: Readonly<UserData> = userData;
  readonly contactDetails: ReadonlyArray<ContactDetails> = contactDetails;

  constructor() {
    this.initializeForm();
    this.setupRouterEvents();
  }

  ngOnInit(): void {
    this.checkZoomLevel();
    window.addEventListener('resize', this.checkZoomLevel.bind(this));
    window.addEventListener('scroll', this.handleNavbarScroll.bind(this), { passive: true });
  }

  ngAfterViewInit(): void {
    this.setupMenuLinks();
    this.setupSectionObserver();
    this.initTypingAnimation();
    this.initSkillBarAnimation();
    this.handleNavbarScroll();
    this.setupSkillCategoryAnimations();

    // Initialize section animations
    this.initSectionAnimations();
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout);
    }
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('scroll', this.handleNavbarScroll);
    window.removeEventListener('resize', this.checkZoomLevel);
    this.observer?.disconnect();
    this.visibleSections.clear();
    this.destroy$.next();
    this.destroy$.complete();
    if (this.animationObserver) {
      this.animationObserver.disconnect();
      this.animationObserver = null;
    }
  }

 // In dashboard.component.ts

// Update this method to handle both section and staggered animations
initSectionAnimations(): void {
  // Set a small delay to ensure the DOM has fully rendered
  setTimeout(() => {
    // First, handle regular section animations
    const animatedSections = document.querySelectorAll('.animate-section');

    // Observer for regular sections
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-active');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    // Observe all animated sections
    animatedSections.forEach(section => {
      sectionObserver.observe(section);
    });

    // Second, handle staggered children separately
    const staggerContainers = document.querySelectorAll('.stagger-children');

    // Observer for stagger containers
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          container.classList.add('animate-active');

          // Manually add classes to children with delays
          const children = container.children;
          Array.from(children).forEach((child, index) => {
            // Set inline delay based on index
            (child as HTMLElement).style.transitionDelay = `${index * 0.1}s`;
            setTimeout(() => {
              child.classList.add('animate-active');
            }, 50); // Small delay to ensure transition works
          });

          staggerObserver.unobserve(container);
        }
      });
    }, { threshold: 0.1 });

    // Observe all stagger containers
    staggerContainers.forEach(container => {
      staggerObserver.observe(container);
    });
  }, 100);
}
  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  private setupRouterEvents(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }

  private setupMenuLinks(): void {
    const menuLinks =
      this.elementRef.nativeElement.querySelectorAll('.menu-link');
    menuLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (event: Event) => {
        event.preventDefault();
        const sectionId = link.getAttribute('data-section');
        if (sectionId) {
          const section = document.getElementById(sectionId);
          this.scrollIntoViewSmooth(section);
        }
      });
    });
  }

  private setupSectionObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
    }

    const sections =
      this.elementRef.nativeElement.querySelectorAll('section[id]');

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;

        if (entry.isIntersecting) {
          this.visibleSections.add(sectionId);
        } else {
          this.visibleSections.delete(sectionId);
        }

        this.updateActiveSection();
      });
    }, INTERSECTION_OBSERVER_OPTIONS);

    sections.forEach((section: Element) => {
      this.observer?.observe(section);
    });

    window.addEventListener('scroll', this.handleScroll.bind(this), {
      passive: true,
    });
  }

  private handleScroll = (): void => {
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = window.setTimeout(() => {
      this.updateActiveSection();
    }, SCROLL_DEBOUNCE);
  };

  private updateActiveSection(): void {
    if (this.visibleSections.size === 0) return;

    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    let maxVisibility = 0;
    let mostVisibleSection = '';

    this.visibleSections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const visibleHeight =
        Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const visibilityRatio = visibleHeight / sectionHeight;

      if (visibilityRatio > maxVisibility) {
        maxVisibility = visibilityRatio;
        mostVisibleSection = sectionId;
      }
    });

    if (mostVisibleSection && this.activeSection !== mostVisibleSection) {
      this.activeSection = mostVisibleSection;
      this.updateActiveLink(mostVisibleSection);
    }
  }

  private updateActiveLink(sectionId: string): void {
    const menuLinks =
      this.elementRef.nativeElement.querySelectorAll('.menu-link');

    menuLinks.forEach((link: Element) => {
      const linkSection = link.getAttribute('data-section');

      if (linkSection === sectionId) {
        link.classList.add('active');
        this.ensureLinkVisible(link);
      } else {
        link.classList.remove('active');
      }
    });
  }

  private ensureLinkVisible(activeLink: Element): void {
    const nav = activeLink.closest('nav');
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
      activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  private scrollIntoViewSmooth(element: HTMLElement | null): void {
    if (!element) return;

    const headerOffset = 72;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }

  private checkZoomLevel(): void {
    this.showSidebarToggle =
      (window.outerWidth / window.innerWidth) * 100 >= ZOOM_THRESHOLD;
  }

  private openSnackBar(message: string, panelClass: string[]): void {
    this.snackBar.open(message, 'Close', {
      duration: SNACKBAR_DURATION,
      panelClass: ['custom-snackbar', ...panelClass],
    });
  }

  // New method to handle navbar background change on scroll
  private handleNavbarScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  // New method to initialize the typing animation
  private initTypingAnimation(): void {
    const phrases = [
      'building impactful applications',
      'solving complex problems',
      'creating intuitive UIs',
      'optimizing performance'
    ];

    const typingElement = document.getElementById('typing-text');

    if (!typingElement) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80; // ms per character
    const deleteSpeed = 40; // ms per character when deleting
    const pauseDuration = 1500; // pause at the end of a phrase

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        // Deleting characters
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 500); // Pause before typing next phrase
        } else {
          setTimeout(type, deleteSpeed);
        }
      } else {
        // Typing characters
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(type, pauseDuration); // Pause at the end of the phrase
        } else {
          setTimeout(type, typingSpeed);
        }
      }
    };

    // Start the typing effect
    setTimeout(type, 1000);
  }

  // New method to animate skill bars on scroll
  private initSkillBarAnimation(): void {
    const skillBars = document.querySelectorAll('.skill-bar-inner');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const percentage = target.parentElement?.parentElement?.querySelector('.skill-level')?.textContent;
          if (percentage) {
            target.style.width = percentage;
          }
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => {
      observer.observe(bar);
    });
  }

  // New method to setup animation delays for skill categories
  private setupSkillCategoryAnimations(): void {
    const categories = document.querySelectorAll('.skill-category');
    categories.forEach((category, index) => {
      (category as HTMLElement).style.setProperty('--animation-delay', `${index * 0.2}`);

      const items = category.querySelectorAll('.skill-item');
      items.forEach((item, itemIndex) => {
        (item as HTMLElement).style.setProperty('--animation-delay', `${itemIndex * 0.1 + index * 0.3}`);
      });
    });
  }

  // New method to determine category icon based on category name
  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'frontend':
        return 'fas fa-laptop-code';
      case 'backend':
        return 'fas fa-server';
      case 'database':
        return 'fas fa-database';
      case 'languages':
        return 'fas fa-code';
      case 'frameworks':
        return 'fas fa-layer-group';
      case 'tools':
        return 'fas fa-tools';
      case 'cloud':
        return 'fas fa-cloud';
      case 'other':
        return 'fas fa-cogs';
      default:
        return 'fas fa-star';
    }
  }

  // New method to scroll to top when footer button is clicked
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  toggleDarkTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }

  showDetails(work: WorkExperience, index: number): void {
    this.workDetails = work.details || [];
    this.selectedCard = index;
  }

  showProjectDetails(project: Project): void {
    this.selectedProject = project;
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeProjectDetails(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedProject = null;
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = '';
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      Object.values(this.contactForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    const emailParams = {
      from_name: this.contactForm.value.name,
      subject: this.contactForm.value.subject || 'New Portfolio Contact',
      message: this.contactForm.value.message,
      from_mail: this.contactForm.value.email,
    };

    try {
      const response = await emailjs.send(
        'service_pf',
        'template_portfolio',
        emailParams,
        { publicKey: 'xbUKzfuh22RF4N59K' }
      );

      if (response.status === 200) {
        this.openSnackBar('Message Sent Successfully!', ['success-message']);
        this.contactForm.reset();
      }
    } catch (error) {
      console.error('Error sending email:', error);
      this.openSnackBar('Error sending email. Please try again.', [
        'error-message',
      ]);
    } finally {
      this.isLoading = false;
    }
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  setActive(section: string): void {
    this.activeSection = section;
    this.closeNavbar();
  }

  toggleNavbar(): void {
    this.isResponsive = !this.isResponsive;
    const navbar = document.getElementById('myTopnav');
    navbar?.classList.toggle('responsive');
  }

  closeNavbar(): void {
    this.isResponsive = false;
    const navbar = document.getElementById('myTopnav');
    navbar?.classList.remove('responsive');
  }
}
