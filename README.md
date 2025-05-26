# CV Builder

📄 A modern, interactive CV builder application that helps you create professional resumes with ease.

## Features

- 🎨 Modern and intuitive user interface
- 📱 Responsive design that works on all devices
- 🔄 Drag and drop sections to reorganize your CV
- 📄 Real-time PDF preview
- 💾 Save and edit multiple CV versions
- 🖨️ Export to PDF
- 🎯 Multiple CV templates to choose from
- 🔥 Firebase integration for data persistence

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 4
- **PDF Generation**: @react-pdf/renderer
- **Drag & Drop**: @dnd-kit
- **Routing**: React Router 7
- **Backend/Database**: Firebase 11
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd cv-builder-client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
cv-builder-client/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/    # React components
│   ├── pages/        # Page components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   ├── styles/       # Global styles
│   ├── App.jsx       # Main App component
│   └── main.jsx      # Entry point
├── index.html
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components styled with [TailwindCSS](https://tailwindcss.com/)
- PDF generation powered by [React-PDF](https://react-pdf.org/)
