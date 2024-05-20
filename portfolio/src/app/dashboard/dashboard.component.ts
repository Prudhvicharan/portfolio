import { ViewportScroller } from '@angular/common';
import { Component, Renderer2, ElementRef, OnInit } from '@angular/core';
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
      title: 'Associate Software Engineer',
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
      title: 'Software Intern',
      date: 'Aug. 2020 – May 2021',
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
      location: 'Kansas, MO',
      startDate: 'January 2023',
      endDate: 'May 2023',
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
      description: 'Company projects using Angular and Typescript frameworks.',
      technologies: ['Angular', 'Typescript'],
      highlights: [
        'Developed UI screens based on client requirements',
        'API integrations',
      ],
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
        'Investigated demographic data',
        'Created accurate classification models',
      ],
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
        'Developed features for admins, doctors, and patients',
        'Implemented specialized contact page',
      ],
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
        'Designed text-based and pin-based login pages',
        'Prevented SQL injections in login and e-commerce website',
      ],
    },
  ];
  skillsData: Category[] = [
    {
      category: 'Languages',
      items: [
        { name: 'Python', percentage: 90 },
        { name: 'HTML5', percentage: 85 },
        { name: 'JavaScript', percentage: 80 },
        { name: 'TypeScript', percentage: 75 },
        { name: 'CSS', percentage: 80 },
        { name: 'SCSS', percentage: 75 },
      ],
    },
    {
      category: 'Developer Tools',
      items: [
        { name: 'VS Code', percentage: 95 },
        { name: 'GitLab', percentage: 90 },
        { name: 'GitHub', percentage: 90 },
        { name: 'Jira', percentage: 85 },
        { name: 'Postman', percentage: 80 },
        // { name: 'Cast', percentage: 75 },
        { name: 'Putty', percentage: 70 },
      ],
    },
    {
      category: 'Frontend Frameworks',
      items: [
        { name: 'Angular 9', percentage: 85 },
        { name: 'PrimeNG', percentage: 80 },
        { name: 'Material-UI', percentage: 75 },
      ],
    },
    {
      category: 'Testing Frameworks',
      items: [
        { name: 'Jasmine', percentage: 80 },
        { name: 'Karma', percentage: 75 },
      ],
    },
  ];
  workDetails: string = '';
  selectedCard: number = 0;
  selectedCardIndex: number = 0;
  contactDetails = [
    {
      text: 'Address',
      detail: '3560 Broadway Blvd, Kansas City',
      icon: 'map',
    },
    {
      text: 'Phone Number',
      detail: '+1 8167628317',
      icon: 'phone',
    },
    {
      text: 'Mail',
      detail: 'bunnycharanprudhvi@gmail.com',
      icon: 'mail',
    },
  ];
  contactForm: FormGroup;
  durationInSeconds = 3;
  isSidebarOpen = false;
  showSidebarToggle = false;

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

  // scrollToSection(sectionId: string) {
  //   const section = document.getElementById(sectionId);
  //   if (section) {
  //     section.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }

  ngOnInit(): void {
    // Check if the zoom level is greater than or equal to 150% initially
    this.checkZoomLevel();
    // Listen for window resize events to dynamically update the zoom level
    window.addEventListener('resize', () => this.checkZoomLevel());
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

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  showDetails(work: any, i: number) {
    console.log('work', work);
    this.workDetails = work.details;
    this.selectedCard = i;
  }

  onSubmit() {
    Object.values(this.contactForm.controls).forEach((control) => {
      control.markAsTouched();
    });

    // Check if the form is valid
    if (this.contactForm.valid) {
      console.log('Form submitted successfully:', this.contactForm.value);
      const serviceID = 'service_pc';
      const templateID = 'template_portfolio';
      const public_key = 'MHJI_yWEoHTODODNh';
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
          if (response && response == '200 OK') {
            this.openSnackBar('Message Sent!', ['success-message']);
          }
        });
      // Here you can send the form data to your backend
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
      // You can optionally display a message to the user to fill in all required fields
    }
  }

  openSnackBar(message: string, panelClass: string[]) {
    this._snackBar.open(message, 'Close', {
      duration: this.durationInSeconds * 100000,
      panelClass: ['custom-snackbar'], // Apply the custom CSS classes here
    });
  }
}
