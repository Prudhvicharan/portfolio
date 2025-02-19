import { ViewportScroller } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
  inject,
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

  isDarkTheme = false;
  selectedProject: Project | null = null;
  workDetails = workExperiences[0].details || '';
  selectedCard = 0;
  contactForm!: FormGroup;
  showSidebarToggle = false;
  activeSection = 'dashboard';
  isLoading = false;

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
  }

  ngAfterViewInit(): void {
    this.setupMenuLinks();
    this.setupSectionObserver();
  }

  ngOnDestroy(): void {
    if (this.scrollTimeout) {
      window.clearTimeout(this.scrollTimeout);
    }
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.checkZoomLevel.bind(this));
    this.observer?.disconnect();
    this.visibleSections.clear();
    this.destroy$.next();
    this.destroy$.complete();
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

  toggleDarkTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
  }

  showDetails(work: WorkExperience, index: number): void {
    this.workDetails = work.details || '';
    this.selectedCard = index;
  }

  showProjectDetails(project: Project): void {
    this.selectedProject = project;
  }

  closeProjectDetails(event?: MouseEvent): void {
    event?.stopPropagation();
    this.selectedProject = null;
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
      subject: this.contactForm.value.subject,
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
        this.openSnackBar('Message Sent!', ['success-message']);
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
    const navbar = document.getElementById('myTopnav');
    navbar?.classList.toggle('responsive');
  }

  closeNavbar(): void {
    const navbar = document.getElementById('myTopnav');
    navbar?.classList.remove('responsive');
  }
}
