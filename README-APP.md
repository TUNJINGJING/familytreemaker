# Family Tree Maker

A modern web application for creating, visualizing, and sharing interactive family trees.

## Features

- 🌳 Interactive family tree visualization powered by D3.js
- ✏️ Easy drag-and-drop editing
- 📸 Photo support for family members
- 🌍 Multi-language support (English, Chinese, Spanish, French, German, Japanese)
- 📱 Mobile-friendly responsive design
- 💾 Cloud storage with Supabase
- 🔐 Secure authentication with NextAuth.js
- 💳 Subscription management with Stripe

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: D3.js (via family-chart library)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **File Storage**: Cloudflare R2
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Cloudflare R2 account (for file storage)
- Stripe account (for payments)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd familytreemaker
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Copy the environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Fill in your environment variables in \`.env.local\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
familytreemaker/
├── app/                  # Next.js app directory
│   ├── [locale]/        # Internationalized routes
│   ├── globals.css      # Global styles
│   └── providers.tsx    # React context providers
├── components/          # React components
│   ├── landing/        # Landing page components
│   └── layout/         # Layout components (navbar, footer)
├── contexts/           # React contexts
├── i18n/              # Internationalization config
├── lib/               # Utility functions
├── messages/          # Translation files
├── providers/         # Additional providers
├── src/               # Original family-chart library (unchanged)
└── config/            # App configuration
\`\`\`

## Development

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run start\` - Start production server
- \`npm run lint\` - Run ESLint

## Original Family Chart Library

This project integrates the [family-chart](https://github.com/donatso/family-chart) library for D3.js-based family tree visualization. The original library code is preserved in the \`src/\` directory.

## License

ISC

## Credits

Built on top of [family-chart](https://github.com/donatso/family-chart) by donatso.
