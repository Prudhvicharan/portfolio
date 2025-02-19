import { ViewportScroller } from '@angular/common';
import {
  Component,
  Renderer2,
  ElementRef,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  isDarkTheme = false;
  selectedProject: Project | null = null;

  workDetails: string = '';
  selectedCard: number = 0;
  selectedCardIndex: number = 0;
  contactForm: FormGroup;
  durationInSeconds = 3;
  showSidebarToggle = false;
  activeSection: string = 'dashboard';
  isLoading: boolean = false;

  workExperiences: WorkExperience[] = workExperiences;
  educationData: Education[] = educationData;
  companyProjectsData: Project[] = companyProjectsData;
  skillsData: Category[] = skillsData;
  userData: UserData = userData;
  contactDetails: ContactDetails[] = contactDetails;
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    // Scroll to top when a route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });

    this.showDetails(workExperiences[0], 0);

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.checkZoomLevel();
    window.addEventListener('resize', () => this.checkZoomLevel());
    // this.openSnackBar('Message Sent!', ['success-message']);
  }

  ngAfterViewInit() {
    const menuLinks = this.el.nativeElement.querySelectorAll('.menu-link');
    menuLinks.forEach((link: HTMLAnchorElement) => {
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior

        const sectionId = link.getAttribute('data-section');
        if (sectionId) {
          const section = document.getElementById(sectionId);
          this.scrollIntoViewSmooth(section);
        }
      });
    });
    this.setupSectionObserver();
  }

  setupSectionObserver(): void {
    const sections = this.el.nativeElement.querySelectorAll('section[id]');
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px 0px -40% 0px', // Adjust the root margin
      threshold: 0.4, // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.activeSection = sectionId;
          this.updateActiveLink(sectionId);
        }
      });
    }, options);

    sections.forEach((section: HTMLElement) => {
      observer.observe(section);
    });
  }

  updateActiveLink(sectionId: string): void {
    const menuLinks = this.el.nativeElement.querySelectorAll('.menu-link');
    menuLinks.forEach((link: HTMLElement) => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  ngOnDestroy() {}

  scrollIntoViewSmooth(element: HTMLElement | null) {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  checkZoomLevel() {
    const zoomLevel = (window.outerWidth / window.innerWidth) * 100;
    // Set showSidebarToggle based on zoom level
    this.showSidebarToggle = zoomLevel >= 175;
  }

  toggleDarkTheme(event: Event) {
    this.isDarkTheme = !this.isDarkTheme;
  }

  showDetails(work: any, i: number) {
    this.workDetails = work.details;
    this.selectedCard = i;
  }

  showProjectDetails(project: Project) {
    this.selectedProject = project;
  }

  closeProjectDetails(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedProject = null;
  }

  onSubmit() {
    Object.values(this.contactForm.controls).forEach((control) => {
      control.markAsTouched();
    });

    if (this.contactForm.valid) {
      this.isLoading = !this.isLoading;
      const serviceID = 'service_pf';
      const templateID = 'template_portfolio';
      const public_key = 'xbUKzfuh22RF4N59K';
      let params = {
        from_name: this.contactForm.value.name,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message,
        from_mail: this.contactForm.value.email,
      };

      emailjs
        .send(serviceID, templateID, params, {
          publicKey: public_key,
        })
        .then((response: any) => {
          if (response && response.status == 200) {
            this.openSnackBar('Message Sent!', ['success-message']);
            this.contactForm.reset();
          }
          this.isLoading = false;
        })
        .catch((error: any) => {
          console.error('Error sending email:', error);
          this.openSnackBar('Error sending email, Please try again.', [
            'error-message',
          ]);
          this.isLoading = false;
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }

  openSnackBar(message: string, panelClass: string[]) {
    this._snackBar.open(message, 'Close', {
      duration: this.durationInSeconds * 3000,
      panelClass: ['custom-snackbar'],
    });
  }

  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  setActive(section: string): void {
    this.activeSection = section;
    this.closeNavbar();
  }

  toggleNavbar(): void {
    const navbar = document.getElementById('myTopnav') as HTMLElement;
    navbar.classList.toggle('responsive');
  }

  closeNavbar(): void {
    const navbar = document.getElementById('myTopnav') as HTMLElement;
    navbar.classList.remove('responsive');
  }
}
