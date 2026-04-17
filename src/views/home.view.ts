const endpointRows = [
  { method: "POST", path: "/register", label: "Register" },
  { method: "POST", path: "/login", label: "Login" },
  { method: "GET", path: "/users/:id", label: "Get User" },
  { method: "GET", path: "/users", label: "All Users" },
  { method: "PUT", path: "/users/:id/block", label: "Block User" }
];

const endpointJson = {
  register: "POST /register",
  login: "POST /login",
  getUser: "GET /users/:id",
  getUsers: "GET /users",
  blockUser: "PUT /users/:id/block"
};

export const homeJsonResponse = {
  message: "User Management Backend is running",
  endpoints: endpointJson
};

export const renderHomePage = (): string => {
  const endpointButtons = endpointRows
    .map(
      (endpoint) => `
        <button class="endpoint-button" type="button" title="${endpoint.label}">
          <span class="method">${endpoint.method}</span>
          <span class="path">${endpoint.path}</span>
        </button>
      `
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>User Management Backend</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #213044;
        --muted: #667085;
        --paper: rgba(255, 255, 255, 0.86);
        --line: rgba(39, 64, 89, 0.14);
        --blue: #4c8bf5;
        --green: #39b980;
        --rose: #f26d8f;
        --gold: #f4b740;
      }

      * {
        box-sizing: border-box;
      }

      body {
        min-height: 100vh;
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--ink);
        background:
          linear-gradient(115deg, rgba(76, 139, 245, 0.14), transparent 32%),
          linear-gradient(245deg, rgba(57, 185, 128, 0.16), transparent 34%),
          linear-gradient(180deg, #fbfdff 0%, #eff7f4 100%);
        background-size: 160% 160%;
        animation: softShift 12s ease-in-out infinite alternate;
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.45;
        background-image:
          linear-gradient(rgba(33, 48, 68, 0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(33, 48, 68, 0.055) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: linear-gradient(to bottom, black, transparent 86%);
      }

      main {
        width: min(920px, calc(100% - 32px));
        min-height: 100vh;
        margin: 0 auto;
        display: grid;
        align-content: center;
        gap: 24px;
        padding: 48px 0;
      }

      .hero {
        padding: 28px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--paper);
        box-shadow: 0 18px 55px rgba(33, 48, 68, 0.11);
        backdrop-filter: blur(18px);
      }

      .status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px;
        color: var(--green);
        font-size: 0.92rem;
        font-weight: 700;
      }

      .status::before {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--green);
        box-shadow: 0 0 0 0 rgba(57, 185, 128, 0.44);
        animation: pulse 1.8s ease-out infinite;
      }

      h1 {
        margin: 0;
        max-width: 760px;
        font-size: clamp(2.25rem, 6vw, 4.7rem);
        line-height: 0.95;
        letter-spacing: 0;
      }

      p {
        max-width: 620px;
        margin: 18px 0 0;
        color: var(--muted);
        font-size: 1.05rem;
        line-height: 1.65;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 26px;
      }

      .primary-link,
      .secondary-link,
      .endpoint-button {
        min-height: 44px;
        border-radius: 8px;
        border: 1px solid transparent;
        cursor: pointer;
        text-decoration: none;
        transition:
          transform 180ms ease,
          box-shadow 180ms ease,
          border-color 180ms ease,
          background 180ms ease;
      }

      .primary-link,
      .secondary-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 18px;
        font-weight: 800;
      }

      .primary-link {
        color: #ffffff;
        background: #2f74e6;
        box-shadow: 0 12px 28px rgba(47, 116, 230, 0.22);
      }

      .secondary-link {
        color: var(--ink);
        border-color: var(--line);
        background: rgba(255, 255, 255, 0.7);
      }

      .primary-link:hover,
      .secondary-link:hover,
      .endpoint-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 16px 30px rgba(33, 48, 68, 0.13);
      }

      .endpoint-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
      }

      .endpoint-button {
        position: relative;
        overflow: hidden;
        display: grid;
        gap: 8px;
        min-width: 0;
        padding: 16px;
        text-align: left;
        color: var(--ink);
        background: rgba(255, 255, 255, 0.74);
        border-color: var(--line);
        font: inherit;
      }

      .endpoint-button::after {
        content: "";
        position: absolute;
        inset: 0;
        translate: -110% 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.72), transparent);
        transition: translate 520ms ease;
      }

      .endpoint-button:hover::after {
        translate: 110% 0;
      }

      .method {
        width: fit-content;
        padding: 4px 8px;
        border-radius: 999px;
        color: #ffffff;
        background: var(--blue);
        font-size: 0.72rem;
        font-weight: 900;
      }

      .endpoint-button:nth-child(2) .method {
        background: var(--green);
      }

      .endpoint-button:nth-child(3) .method,
      .endpoint-button:nth-child(4) .method {
        background: var(--gold);
      }

      .endpoint-button:nth-child(5) .method {
        background: var(--rose);
      }

      .path {
        position: relative;
        z-index: 1;
        font-family: "Cascadia Code", "SFMono-Regular", Consolas, monospace;
        font-size: 0.88rem;
        overflow-wrap: anywhere;
      }

      @keyframes softShift {
        from {
          background-position: 0% 50%;
        }

        to {
          background-position: 100% 50%;
        }
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(57, 185, 128, 0.44);
        }

        75% {
          box-shadow: 0 0 0 12px rgba(57, 185, 128, 0);
        }

        100% {
          box-shadow: 0 0 0 0 rgba(57, 185, 128, 0);
        }
      }

      @media (max-width: 760px) {
        main {
          align-content: start;
          padding-top: 28px;
        }

        .hero {
          padding: 22px;
        }

        .endpoint-grid {
          grid-template-columns: 1fr;
        }

        .primary-link,
        .secondary-link {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero" aria-labelledby="page-title">
        <div class="status">Server running on port 3000</div>
        <h1 id="page-title">User Management Backend</h1>
        <p>
          Express, TypeScript, MySQL, JWT, and bcrypt API for secure user registration,
          login, admin access, and account blocking.
        </p>
        <div class="actions">
          <a class="primary-link" href="/health">JSON status</a>
          <a class="secondary-link" href="https://www.postman.com/" rel="noreferrer" target="_blank">Open Postman</a>
        </div>
      </section>

      <section class="endpoint-grid" aria-label="Available API endpoints">
        ${endpointButtons}
      </section>
    </main>
  </body>
</html>`;
};
