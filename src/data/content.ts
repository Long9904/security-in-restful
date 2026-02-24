import type {
  HeroSectionProps,
  SideBySideComparisonCardProps,
  GridListProps,
  InteractiveDiagramProps,
  SequenceDiagramListProps,
  ProsConsTableProps,
  CallOutBlockProps,
} from '../types';

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const heroData: HeroSectionProps = {
  title: 'Security in RESTful WebService',
  subtitle: 'Why does your system need to be protected?',
  content: [
    'Data Protection: Clearly define access rights, especially for methods like DELETE (remove a resource) and PUT (update a resource).',
    'DoS Prevention: Stop your API from going down due to being flooded with requests when there are no proper defenses in place.',
    'Anti-Farming: Without authentication and authorization, your API can be abused — overloading the server and slowing down response times for everyone.',
  ],
};

// ─── Core Concepts ────────────────────────────────────────────────────────────

export const comparisonData: SideBySideComparisonCardProps = {
  title: 'Core Concepts: Authentication vs Authorization',
  leftCard: {
    header: 'Authentication',
    icon: 'ShieldCheck',
    description:
      "The process of verifying who you are. The user provides credentials that get checked against what's stored in the system.",
    analogy:
      'Like swiping your ID card to get through the front door of a server building.',
  },
  rightCard: {
    header: 'Authorization',
    icon: 'Key',
    description:
      "The process of deciding what you're allowed to do. Once you're in, it controls which resources you can access and what actions you can take.",
    analogy:
      "Once you're inside the building, it decides which rooms you can enter and which equipment you can touch.",
  },
};

// ─── Best Practices ───────────────────────────────────────────────────────────

export const bestPracticesData: GridListProps = {
  title: 'Best Practices for RESTful APIs',
  items: [
    {
      title: 'Validation',
      desc: 'Always validate every input on the server side to protect against SQL/NoSQL injection attacks.',
    },
    {
      title: 'No Sensitive Data in URL',
      desc: 'Never put usernames, passwords, or tokens in the URL. Use POST instead.',
    },
    {
      title: 'Method Restriction',
      desc: 'Strictly limit which HTTP methods (GET, POST, DELETE) are allowed per endpoint. A GET should never be able to delete data.',
    },
    {
      title: 'Generic Error Messages',
      desc: 'Use standard HTTP error codes (e.g. 403 Forbidden) without leaking internal details.',
    },
  ],
};

// ─── JWT Diagram ──────────────────────────────────────────────────────────────

export const jwtDiagramData: InteractiveDiagramProps = {
  title: 'JSON Web Token (JWT) Architecture',
  description:
    'A JWT has 3 parts: Header, Payload, and Signature. It is compact and easy to pass around in HTTP and HTML environments.',
  diagramSteps: [
    {
      step: '1',
      boxLabel: 'Header',
      detail:
        'Contains the algorithm (e.g. HMAC SHA256) and token type (JWT). Encoded with Base64Url.',
      color: 'bg-red-100 text-red-800 border-red-300',
    },
    {
      step: '2',
      boxLabel: 'Payload',
      detail:
        "Contains 'claims' — user info like sub, name, iat. Don't store sensitive data here since it's only encoded, not encrypted.",
      color: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    {
      step: '3',
      boxLabel: 'Signature',
      detail:
        'Created by combining the encoded header, encoded payload, and a secret key. Ensures the token has not been tampered with.',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
  ],
};

// ─── Security Flow ────────────────────────────────────────────────────────────

export const securityFlowData: SequenceDiagramListProps = {
  title: 'Security Flow Overview',
  flows: [
    {
      flowName: 'Accessing Without Authentication',
      steps: [
        'Request hits the Authentication Middleware.',
        'Middleware checks for credentials. If none found, the user is set as anonymous.',
        'Authorization Middleware checks permissions. If access is required, it calls ChallengeAsync() to reject or redirect.',
      ],
    },
    {
      flowName: 'Signing In',
      steps: [
        'User sends their ID & Password through the login form.',
        'System verifies credentials against the database.',
        'If using JWT, a JWT Token is created containing the user claims.',
        'JWT Token is sent back to the client to be stored (Local Storage, session, or cookie).',
      ],
    },
    {
      flowName: 'Subsequent Requests',
      steps: [
        'User sends a request with the token in the Authorization header.',
        'Authentication Middleware reads the token, creates a ClaimsIdentity, and updates the HttpContext.',
        'Authorization Middleware checks HttpContext.User and grants access accordingly.',
      ],
    },
  ],
};

// ─── Pros/Cons ────────────────────────────────────────────────────────────────

export const prosConsData: ProsConsTableProps = {
  title: 'JWT in RESTful — Pros & Cons',
  pros: [
    'Compact: Smaller than XML/SAML, making it lightweight for HTTP transport.',
    'Easy to parse: JSON maps directly to objects in almost every programming language.',
    'Stateless: The server does not need to store sessions, making horizontal scaling simple.',
  ],
  cons: [
    'Cannot be revoked immediately: Tokens have an expiry, so a leaked token stays valid until it expires.',
    'Payload is exposed: The payload is only Base64-encoded, not encrypted — avoid storing sensitive data inside.',
  ],
};

// ─── Conclusion ───────────────────────────────────────────────────────────────

export const conclusionData: CallOutBlockProps = {
  title: 'Conclusion',
  content:
    'Securing a WebService is not just about handing out tokens. It is a full strategy — from encrypting the transport layer (TLS/SSL) and validating inputs, to managing identity (Authentication) and enforcing strict access control (Authorization) based on roles or policies. JWT is the go-to solution for modern REST APIs thanks to its stateless nature and compact size.',
};
