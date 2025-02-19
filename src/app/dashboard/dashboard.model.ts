export interface Education {
  institution: string;
  degree: string;
  gpa?: number; // Optional GPA field
  location: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  highlights: string[];
  showHighlights?: boolean;
}

export interface Skill {
  name: string;
  percentage?: number; // Optional for languages & testing frameworks
}

export interface Category {
  category: string;
  items: Skill[];
}

export interface WorkExperience {
  title: string;
  date: string;
  location: string;
  details: string[];
}

export interface UserData {
  name: string;
  role: string;
  email: string;
  phone: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
}

export interface ContactDetails {
  text: string;
  detail: string;
  icon: string;
}
