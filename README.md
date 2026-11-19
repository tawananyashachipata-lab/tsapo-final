# Tsapo – Smart Parcel Delivery & Tracking Platform

**Tsapo is a digital parcel delivery and tracking platform designed to make sending and receiving goods across Zimbabwe easier, safer and more convenient.**

Tsapo provides a structured way for individuals and small businesses to send packages to family members, friends and customers without relying entirely on informal parcel delivery arrangements.

## About Tsapo

In Zimbabwe, people frequently use buses and other transport services to send goods between cities and towns. However, informal delivery arrangements can make it difficult to track parcels, confirm arrivals and ensure that goods reach the correct recipients.

Tsapo aims to address these challenges by introducing a digital system that connects senders, recipients and delivery agents through one platform.

Whether someone is sending a package to a family member or a small business is delivering an order to a customer, Tsapo helps make the process more organised and transparent.

## How Tsapo Works

The platform follows a simple parcel delivery process:

### 1. Sender Creates a Parcel Request
The sender accesses the Tsapo website, creates an account and provides the necessary parcel information, including:
- Sender details.
- Recipient details.
- Parcel description.
- Collection and destination locations.
- Relevant delivery information.

### 2. Parcel Is Assigned to a Tsapo Agent
The parcel is taken to or received by a designated Tsapo agent. The agent helps coordinate the parcel's movement towards its destination.

### 3. Parcel Tracking
The system provides parcel tracking information so that senders and recipients can follow the delivery process and stay informed about parcel progress.

### 4. Arrival Notification
When the parcel reaches its destination agent, its status is updated to indicate that it is ready for collection.

### 5. Recipient Collects the Parcel
The recipient visits the designated collection point and presents their unique pickup code for verification.

Once the parcel is successfully handed over, the delivery can be marked as completed.

## Key Features

- **User Authentication:** Secure account registration and sign-in.
- **Parcel Management:** Create and manage parcel delivery requests.
- **Parcel Tracking:** Monitor parcel progress and delivery statuses.
- **Pickup Codes:** Unique codes to support secure parcel collection.
- **Agent Management:** Support for agents who coordinate parcel handling and collection.
- **Delivery Notifications:** Keep users informed about important parcel updates.
- **AI-Powered Assistant:** An intelligent assistant designed to help users understand Tsapo services, parcel procedures and frequently asked questions.

## The Tsapo AI Assistant

Tsapo incorporates an AI-powered customer support assistant intended to make the platform easier to use.

The assistant can help users:
- Understand how Tsapo works.
- Learn how to send and receive parcels.
- Understand parcel tracking and pickup procedures.
- Find information about agent services.
- Get answers to frequently asked questions.

The AI assistant is designed to provide accessible customer support using clear and straightforward language.

## Technology Stack

Tsapo is developed using modern web technologies.

- **Frontend:** React.js, JavaScript, HTML and CSS.
- **Build Tool:** Vite.
- **Backend:** Node.js and Express.
- **Database:** Prisma ORM with the configured database provider.
- **AI Integration:** OpenAI API.
- **Version Control:** Git and GitHub.

## Project Structure

```text
tsapo-platform/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── server/
│   ├── db.js
│   ├── index.js
│   └── middleware.js
├── src/
│   ├── App.jsx
│   ├── api.js
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js
- npm
- A configured database supported by the Prisma schema.

### Installation

Clone the repository:

```bash
git clone https://github.com/tawananyashachipata-lab/tsapo-platform.git
```

Navigate into the project:

```bash
cd tsapo-platform
```

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Configure the required environment variables in `.env`, including database connection details and your OpenAI API key if AI integration is enabled.

Run the required Prisma setup commands according to your configured database and migrations.

Start the application using the scripts defined in `package.json`.

## Project Vision

Tsapo aims to improve how goods move between people and businesses in Zimbabwe by making parcel delivery more organised, traceable and reliable.

The long-term vision is to build a trusted digital parcel delivery network that connects communities, transport routes and local agents.

**Tsapo – Making sending and receiving goods simpler, smarter and more reliable.**

