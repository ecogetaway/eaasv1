// EaaS Operator Portal — Separate deployment from consumer app.
// Security & compliance mandate frontend + services separation.
// Shared database sits behind firewall and proxy. No direct client access.
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VALID_EMAIL = "admin@intellismart.in";
const VALID_PASSWORD = "admin123";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(VALID_EMAIL);
  const [password, setPassword] = useState(VALID_PASSWORD);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((previousState) => !previousState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = email === VALID_EMAIL && password === VALID_PASSWORD;
    if (!isValid) {
      setErrorMessage("Access denied. Invalid credentials.");
      return;
    }

    localStorage.setItem("isAdminAuthenticated", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0D2137] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <header className="relative z-10 flex w-full items-center justify-between border-b border-white/[0.06] px-8 py-4">
        <div className="flex items-center gap-2 text-sm font-bold sm:text-base">
          <span className="text-green-600">⚡</span>
          <span>IntelliSmart Operator Portal</span>
        </div>
        <div className="font-mono text-xs text-gray-500">intellismart-admin.netlify.app</div>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-112px)] items-center justify-center px-4 py-10 pb-24">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-[#0D2137] shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            ⚡
          </div>
          <h1 className="text-center text-2xl font-bold text-[#0D2137]">IntelliSmart</h1>
          <p className="mt-1 text-center text-sm text-gray-500">Operator Portal — Secure Access</p>

          <div className="mx-auto mt-2 inline-flex w-fit items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            🔒 Authorised Representatives Only
          </div>

          <div className="my-5 border-t border-gray-100" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="operator-email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                OPERATOR EMAIL
              </label>
              <input
                id="operator-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-green-500/30"
                aria-label="Operator email"
              />
            </div>

            <div>
              <label
                htmlFor="operator-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="operator-password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 pr-10 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-green-500/30"
                  aria-label="Operator password"
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-white/80 hover:text-gray-700"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25"
              aria-label="Sign In to Portal"
            >
              Sign In to Portal →
            </button>
          </form>

          <p className="mt-4 text-center text-xs leading-relaxed text-gray-400">
            Access restricted to IntelliSmart representatives.
            <br />
            Unauthorised access is prohibited.
          </p>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10 flex w-full items-center justify-between border-t border-white/[0.06] bg-[#0D2137] px-8 py-3">
        <div className="font-mono text-xs text-gray-600">intellismart-admin.netlify.app</div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span>Systems operational</span>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
