import {
  Education,
  Project,
  Category,
  WorkExperience,
  UserData,
} from './dashboard.model';

export const educationData: Education[] = [
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

export const companyProjectsData: Project[] = [
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
    technologies: ['Data mining', 'Machine learning', 'Classification models'],
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
    description: 'Fully functional website for admins, doctors, and patients.',
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

export const skillsData: Category[] = [
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

export const workExperiences: WorkExperience[] = [
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

export const userData: UserData = {
  name: 'Sai Prudhvi Charan Pothumsetty',
  role: 'Full Stack Developer.',
  email: 'prudhvicharan43@gmail.com',
  phone: '8167628317',
  facebook: 'https://www.facebook.com/profile.php?id=100008269187928',
  linkedin: 'https://www.linkedin.com/in/prudhvi-charan/',
  github: 'https://github.com/Prudhvicharan',
};

export const contactDetails = [
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
