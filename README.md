# Personal Portfolio Website

## Overview 🌟
A modern and responsive personal portfolio website built with Angular, designed to showcase professional experience, technical skills, and featured projects. The site features smooth animations, Material Design components, and a fully functional contact system powered by EmailJS.

## Live Demo 🎯
[View Portfolio](https://prudhvicharan.github.io/portfolio/)

## Features ✨
- **Responsive Design**: Seamlessly adapts to all screen sizes and devices
- **Interactive UI**: Smooth animations and transitions using Angular Material
- **Project Showcase**: Dedicated section highlighting key projects and achievements
- **Skills Display**: Visual representation of technical skills and expertise
- **Contact Form**: Integrated EmailJS for direct communication
- **Performance Optimized**: Fast loading times and smooth user experience

## Technologies Used 🛠️
- **Core Framework**: Angular 16.2
- **UI Library**: Angular Material
- **Styling**: SCSS with custom theming
- **Icons**: Font Awesome & Material Design Icons
- **Email Integration**: EmailJS
- **Version Control**: Git & GitHub
- **Deployment**: GitHub Pages

## Prerequisites 📋
- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v16.2)

## Installation & Setup 🚀

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm start
```
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Building for Production 📦

Run the following command to build the project:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment 🌐

Deploy to GitHub Pages using:
```bash
npm run deploy
```

## Project Structure 📁
```
portfolio/
├── src/
│   ├── app/
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── .gitignore
├── angular.json
├── package.json
├── README.md
└── tsconfig.json

```

## Key Dependencies 📚
- `@angular/core`: ^16.2.0
- `@angular/material`: ^16.2.0
- `@emailjs/browser`: ^3.x.x
- `@fortawesome/fontawesome-free`: ^6.x.x


## 📧 EmailJS Integration

### Email Service Implementation

EmailJS is used to handle form submissions and send emails directly from the client-side without a backend server. In this portfolio project, it provides a seamless way to receive messages from visitors through the contact form.

#### Key Implementation Details:
- **Library**: `@emailjs/browser`
- **Purpose**: Send contact form submissions directly to your email
- **Configuration**:
  - Requires EmailJS account setup
  - Involves creating an email template
  - Configuring service and template IDs

#### How It Works:
1. **Form Submission**: When a user fills out the contact form, EmailJS captures the form data
2. **Client-Side Sending**: Sends email directly from the browser
3. **No Backend Required**: Eliminates need for server-side email handling
4. **Secure**: Uses environment variables to protect sensitive information

#### Example Implementation Snippet:
```typescript
sendEmail(formData: any) {
  emailjs.send(
    'YOUR_SERVICE_ID',   // EmailJS service ID
    'YOUR_TEMPLATE_ID',  // Email template ID
    formData,            // Form submission data
    'YOUR_PUBLIC_KEY'    // EmailJS public key
  );
}
```
## Contributing 🤝
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact 📫
- Gmail - [bunnycharanprudhvi@gmail.com](mailto:bunnycharanprudhvi@gmail.com)
- LinkedIn: [PrudhviCharan](https://www.linkedin.com/in/prudhvi-charan/)
- GitHub: [PrudhviCharan](https://github.com/PrudhviCharan)

## Acknowledgments 🙏
- Angular Team for the amazing framework
- Material Design Team for the UI components
- All open-source contributors whose libraries were used in this project
