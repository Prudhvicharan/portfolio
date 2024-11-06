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

interface Education {
  institution: string;
  degree: string;
  gpa?: number; // Optional GPA field
  location: string;
  startDate: string;
  endDate: string;
}

interface Project {
  title: string;
  description: string;
  technologies: string[];
  highlights: string[];
  showHighlights?: boolean;
}

interface Skill {
  name: string;
  percentage?: number; // Optional for languages & testing frameworks
}

interface Category {
  category: string;
  items: Skill[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  isDarkTheme = false;
  workExperiences = [
    {
      title: 'Software Engineer',
      date: 'June 2021 – Dec 2022',
      location: 'Vitrana Bangalore, KA, India',
      details: [
        'Developed and maintained engaging user interfaces for multiple company projects using Angular 9 and TypeScript.',
        'Leveraged Angular to create interactive web applications, delivering exceptional user experiences.',
        "Drove seamless API integrations, fostering robust interactions within the microfrontend architecture, ensuring the projects' responsiveness and cohesion.",
        'Contributed to the development process through rigorous unit testing using Jasmine and Karma, guaranteeing the reliability and stability of the applications.',
        'Implemented performance optimization strategies using CAST tools, significantly enhancing the speed and efficiency of project execution.',
      ],
    },
    {
      title: 'Associate Software Engineer',
      date: 'Dec. 2019 – May 2021',
      location: 'Vitrana Bangalore, KA, India',
      details: [
        'Participated in intensive training programs focused on Angular, JavaScript, and TypeScript, enhancing my proficiency in these technologies.',
        "Successfully replicated the login and home screens for the company's flagship project, HiLIT, showcasing my ability to work with complex and critical components of the application.",
        'Skillfully recreated the Capei form page, characterized by dynamic and data-intensive forms, demonstrating my adaptability and capacity to handle diverse tasks.',
        'Pioneered the development of a new dashboard screen, responsible for displaying critical data not previously implemented by the company. The screen was well-received, and my lead utilized my work as a basis for design team discussions.',
        "Collaborated closely with team members, providing valuable insights and innovative solutions, contributing to the overall project's success.",
      ],
    },
  ];
  educationData: Education[] = [
    {
      institution: 'University of Missouri Kansas City',
      degree: 'Masters in Computer Science',
      gpa: 3.8,
      location: 'Kansas, MO',
      startDate: 'January 2023',
      endDate: 'May 2024',
    },
    {
      institution: 'Vellore Institute of Technology',
      degree: 'Mtech Integrated Software Engineering',
      gpa: 8.67,
      location: 'Vellore, TN, India',
      startDate: 'Aug 2016',
      endDate: 'May 2021',
    },
    // Add more entries for your education history
  ];
  companyProjectsData: Project[] = [
    {
      title: 'HILIT, HICOD, CAPEI',
      description: 'Company projects using Angular and TypeScript frameworks.',
      technologies: ['Angular', 'HTML', 'SCSS', 'TypeScript'],
      highlights: [
        'Developed and maintained user interfaces for MedDRA Dictionary and WHO Dictionary, replicating Argus Dictionaries with a new UI.',
        'Created Admin MedDRA screen to read and upgrade new version MedDRA files, implementing file uploading functionality.',
        'Designed Admin Synonyms Screen for adding new synonyms.',
        'Redesigned the CSI homepage and Global Variables UI screens based on new wireframes.',
        'Refactored the navigation microfrontend, used across all company projects, ensuring improved efficiency and consistency.',
        'Developed the SDTM screen with dynamically populated sections and tables based on API responses.',
        'Resolved assigned bugs within deadlines.',
      ],
      showHighlights: false,
    },
    {
      title: 'Income Classification Using Adult Census Data',
      description: 'Data mining project to identify high-income individuals.',
      technologies: [
        'Data mining',
        'Machine learning',
        'Classification models',
      ],
      highlights: [
        'Preprocessed and analyzed Adult Census dataset with 48,842 instances and 14 attributes.',
        'Implemented multiple classification models including Random Forest, XGBoost, and Logistic Regression.',
        'Achieved 85% accuracy in predicting individuals with income >$50K/year.',
        'Identified top 5 factors influencing high income: education, occupation, age, work hours, and capital gains.',
        'Developed a web interface using Flask for real-time income predictions.',
        'Applied SMOTE to address class imbalance, improving model performance.',
        'Utilized feature importance analysis to enhance model interpretability.',
        'Conducted thorough model evaluation using metrics such as precision, recall, and F1-score.',
      ],
      showHighlights: false,
    },
    {
      title: 'Hospital Management System',
      description:
        'Fully functional website for admins, doctors, and patients.',
      technologies: [
        'Web development',
        'Database management',
        'User interface design',
      ],
      highlights: [
        'Developed a comprehensive web-based system with role-based access for admins, doctors, and patients.',
        'Implemented secure user authentication and authorization using JWT.',
        'Created an intuitive dashboard for admins to manage hospital resources, staff, and patient records.',
        'Designed a user-friendly interface for doctors to view appointments, update patient diagnoses, and manage prescriptions.',
        'Built a patient portal for appointment booking, medical history access, and bill payments.',
        'Integrated a real-time notification system for appointment reminders and important updates.',
        'Implemented a specialized contact page with dynamic form routing based on inquiry type.',
        'Utilized responsive design principles to ensure seamless functionality across devices.',
        'Employed MySQL for efficient data management and retrieval of medical records.',
        'Incorporated data visualization tools for admins to analyze hospital performance metrics.',
      ],
      showHighlights: false,
    },
    {
      title: 'Preventing Websites from SQL Injections',
      description: 'Developed secure login pages and e-commerce website.',
      technologies: [
        'Security best practices',
        'Web development',
        'Database protection',
      ],
      highlights: [
        'Created unsecured login and e-commerce pages where SQL injection vulnerabilities were demonstrated (e.g., entering queries like "1=1" to bypass authentication or "SELECT * FROM books" to retrieve all book data).',
        'Secured the login pages and admin pages by implementing MD5 and SHA algorithms to hash passwords and prevent unauthorized access.',
        'Validated user inputs across all pages to filter out and prevent malicious SQL queries, protecting against injection attacks.',
        'Enhanced the security of the e-commerce page by preventing SQL injection attempts from exposing sensitive data.',
        'Developed and integrated a secure passcode and password login system with robust protection mechanisms.',
        'Conducted thorough testing to ensure that all SQL injection vulnerabilities were addressed and fixed.',
        'Provided detailed documentation and best practices for securing web applications against SQL injection attacks.',
      ],
      showHighlights: false,
    },
  ];
  selectedProject: Project | null = null;
  skillsData: Category[] = [
    {
      category: 'Programming Languages',
      items: [
        { name: 'JavaScript', percentage: 80 },
        { name: 'TypeScript', percentage: 90 },
        { name: 'Python', percentage: 90 },
        { name: 'SQL', percentage: 80 },
        { name: 'HTML5', percentage: 90 },
        { name: 'CSS', percentage: 85 },
        { name: 'SCSS', percentage: 90 },
      ],
    },
    {
      category: 'Developer Tools',
      items: [
        { name: 'VS Code', percentage: 95 },
        // { name: 'Git', percentage: 90 },
        { name: 'GitLab', percentage: 90 },
        { name: 'GitHub', percentage: 90 },
        { name: 'Jira', percentage: 85 },
        { name: 'Postman', percentage: 80 },
        // { name: 'CAST', percentage: 75 },
        { name: 'PuTTY', percentage: 70 },
      ],
    },
    {
      category: 'Frontend Frameworks',
      items: [
        { name: 'Angular', percentage: 85 },
        { name: 'AngularJS', percentage: 70 },
        { name: 'Bootstrap', percentage: 80 },
        // { name: 'Responsive Design', percentage: 80 },
      ],
    },
    {
      category: 'Backend Technologies',
      items: [
        { name: 'Node.js', percentage: 80 },
        { name: 'Express.js', percentage: 70 },
        { name: 'MySQL', percentage: 65 },
        { name: 'MongoDB', percentage: 75 },
      ],
    },
    {
      category: 'Testing Frameworks',
      items: [
        { name: 'Jasmine', percentage: 80 },
        { name: 'Karma', percentage: 75 },
        { name: 'Selenium IDE', percentage: 70 },
      ],
    },
    {
      category: 'Protocols and Formats',
      items: [
        { name: 'RESTful APIs', percentage: 75 },
        { name: 'JSON', percentage: 85 },
      ],
    },
  ];

  workDetails: string = '';
  selectedCard: number = 0;
  selectedCardIndex: number = 0;
  contactDetails = [
    {
      text: 'Address',
      detail: 'Kansas City, MO',
      icon: 'map',
    },
    {
      text: 'Mobile',
      detail: '+1 (816) 762-8317',
      icon: 'phone',
    },
    {
      text: 'Mail',
      detail: 'prudhvicharan43@gmail.com',
      icon: 'mail',
    },
  ];
  contactForm: FormGroup;
  durationInSeconds = 3;
  showSidebarToggle = false;
  activeSection: string = 'dashboard';
  isLoading: boolean = false;
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

    this.showDetails(this.workExperiences[0], 0);

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Check if the zoom level is greater than or equal to 150% initially
    this.checkZoomLevel();
    // Listen for window resize events to dynamically update the zoom level
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
    console.log('work', work);
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

    // Check if the form is valid
    if (this.contactForm.valid) {
      this.isLoading = !this.isLoading; // Start loading
      console.log('Form submitted successfully:', this.contactForm.value);
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
          console.log('response', response);
          if (response && response.status == 200) {
            this.openSnackBar('Message Sent!', ['success-message']);
            this.contactForm.reset();
          }
          this.isLoading = false; // Stop loading
        })
        .catch((error: any) => {
          console.error('Error sending email:', error);
          this.openSnackBar('Error sending email, Please try again.', [
            'error-message',
          ]);
          this.isLoading = false; // Stop loading
        });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
      // You can optionally display a message to the user to fill in all required fields
    }
  }

  openSnackBar(message: string, panelClass: string[]) {
    console.log('message', message);
    this._snackBar.open(message, 'Close', {
      duration: this.durationInSeconds * 3000,
      panelClass: ['custom-snackbar'], // Apply the custom CSS classes here
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
    if (navbar.className.includes('responsive')) {
      navbar.className = navbar.className.replace(' responsive', '');
    } else {
      navbar.className += ' responsive';
    }
  }

  closeNavbar(): void {
    const navbar = document.getElementById('myTopnav') as HTMLElement;
    navbar.className = navbar.className.replace(' responsive', '');
  }
}
