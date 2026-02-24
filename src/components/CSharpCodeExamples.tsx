import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Key, ShieldCheck, Activity, FileCheck, Lock, Copy, Check,
  ChevronRight, Code2, Terminal, Layers
} from 'lucide-react';

// ─── Code data ────────────────────────────────────────────────────────────────

interface CodeTab {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  description: string;
  files: CodeFile[];
}

interface CodeFile {
  filename: string;
  lang: string;
  code: string;
}

const CODE_TABS: CodeTab[] = [
  {
    id: 'jwt',
    label: 'JWT Authentication',
    icon: Key,
    color: 'amber',
    badge: 'Microsoft.AspNetCore.Authentication.JwtBearer',
    description: 'Set up JWT Bearer Authentication in ASP.NET Core. The server verifies the token signature using a secret key, extracts the claims, and assigns them to HttpContext.User.',
    files: [
      {
        filename: 'Program.cs',
        lang: 'csharp',
        code: `using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ① Read the secret key from appsettings.json (NEVER hard-code!)
var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;

// ② Register Authentication + set JwtBearer as the default scheme
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidateLifetime         = true,   // Check expiry (exp)
        ValidateIssuerSigningKey = true,   // Verify signature
        ValidIssuer              = jwtIssuer,
        ValidAudience            = jwtIssuer,
        IssuerSigningKey         = new SymmetricSecurityKey(
                                       Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew                = TimeSpan.Zero // No clock drift tolerance
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

// ③ Middleware order matters!
app.UseAuthentication(); // Must come before UseAuthorization
app.UseAuthorization();
app.MapControllers();
app.Run();`,
      },
      {
        filename: 'Services/TokenService.cs',
        lang: 'csharp',
        code: `using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config) => _config = config;

    public string GenerateToken(ApplicationUser user)
    {
        // ① Build the claims list (JWT payload)
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // JWT ID
            new(ClaimTypes.Role, user.Role)   // Used for Authorization
        };

        // ② Build the signing key from the secret
        var key  = new SymmetricSecurityKey(
                       Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // ③ Build the token descriptor
        var token = new JwtSecurityToken(
            issuer:             _config["Jwt:Issuer"],
            audience:           _config["Jwt:Issuer"],
            claims:             claims,
            expires:            DateTime.UtcNow.AddHours(2),  // Expires in 2 hours
            signingCredentials: cred
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}`,
      },
      {
        filename: 'Controllers/AuthController.cs',
        lang: 'csharp',
        code: `[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly TokenService _tokenService;
    private readonly UserManager<ApplicationUser> _userManager;

    public AuthController(TokenService tokenService,
                          UserManager<ApplicationUser> userManager)
    {
        _tokenService = tokenService;
        _userManager  = userManager;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        // ① Look up user by email
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return Unauthorized(new { error = "Invalid credentials" }); // Generic msg!

        // ② Verify password (bcrypt internally)
        var valid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!valid)
            return Unauthorized(new { error = "Invalid credentials" }); // Don't reveal which field was wrong

        // ③ Issue JWT
        var token = _tokenService.GenerateToken(user);
        return Ok(new { token, expiresIn = 7200 });
    }
}`,
      },
    ],
  },
  {
    id: 'authz',
    label: 'Authorization (RBAC)',
    icon: ShieldCheck,
    color: 'violet',
    badge: 'Role-Based & Policy-Based',
    description: 'Control access by Role or Policy. ASP.NET Core Authorization Middleware automatically validates the user claims before allowing the request to reach the handler.',
    files: [
      {
        filename: 'Program.cs — Authorization Policies',
        lang: 'csharp',
        code: `builder.Services.AddAuthorization(options =>
{
    // ① Simple policy: Admin only
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));

    // ② Combined conditions policy
    options.AddPolicy("SeniorEmployee", policy =>
        policy.RequireRole("Manager", "Admin")
              .RequireClaim("department", "IT", "Finance")
              .RequireAuthenticatedUser());

    // ③ Custom policy with a requirement
    options.AddPolicy("MinimumAge18", policy =>
        policy.Requirements.Add(new MinAgeRequirement(18)));

    // ④ Default policy: must be logged in
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

// Register custom handler
builder.Services.AddScoped<IAuthorizationHandler, MinAgeHandler>();`,
      },
      {
        filename: 'Controllers/AdminController.cs',
        lang: 'csharp',
        code: `[ApiController]
[Route("api/[controller]")]
[Authorize]  // ← Entire controller: must be logged in
public class AdminController : ControllerBase
{
    // ① Admin only
    [HttpGet("dashboard")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetDashboard()
        => Ok(new { message = "Admin dashboard" });

    // ② Use policy name
    [HttpGet("reports")]
    [Authorize(Policy = "SeniorEmployee")]
    public IActionResult GetReports()
        => Ok(new { data = "Confidential reports" });

    // ③ Allow anonymous (overrides [Authorize] on controller)
    [HttpGet("public-info")]
    [AllowAnonymous]
    public IActionResult GetPublicInfo()
        => Ok(new { info = "Public information" });

    // ④ Manual authorization check inside logic
    [HttpDelete("users/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(
        int id,
        IAuthorizationService authz)
    {
        var result = await authz.AuthorizeAsync(User, id, "CanDelete");
        if (!result.Succeeded)
            return Forbid(); // 403

        // ... delete logic
        return NoContent();
    }
}`,
      },
      {
        filename: 'Requirements/MinAgeRequirement.cs',
        lang: 'csharp',
        code: `// Custom Requirement
public class MinAgeRequirement : IAuthorizationRequirement
{
    public int MinimumAge { get; }
    public MinAgeRequirement(int minimumAge) => MinimumAge = minimumAge;
}

// Custom Handler
public class MinAgeHandler : AuthorizationHandler<MinAgeRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        MinAgeRequirement requirement)
    {
        // Read the "birthdate" claim from JWT payload
        var dob = context.User.FindFirst(c => c.Type == "birthdate")?.Value;

        if (dob != null &&
            DateTime.TryParse(dob, out var birthDate) &&
            DateTime.Today.Year - birthDate.Year >= requirement.MinimumAge)
        {
            context.Succeed(requirement); // ✅ Access granted
        }
        // else: context.Fail() or do nothing → access denied

        return Task.CompletedTask;
    }
}`,
      },
    ],
  },
  {
    id: 'ratelimit',
    label: 'Rate Limiting',
    icon: Activity,
    color: 'rose',
    badge: 'Microsoft.AspNetCore.RateLimiting (.NET 7+)',
    description: 'Limit the number of requests per IP/user within a time window. The built-in .NET 7+ Rate Limiter supports Fixed Window, Sliding Window, Token Bucket, and Concurrency limiters.',
    files: [
      {
        filename: 'Program.cs',
        lang: 'csharp',
        code: `using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRateLimiter(options =>
{
    // ① Fixed Window: 10 req per 15 sec per IP
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.PermitLimit         = 10;
        opt.Window              = TimeSpan.FromSeconds(15);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit          = 5;  // Max 5 queued requests
    });

    // ② Sliding Window: smoother, divides the window into segments
    options.AddSlidingWindowLimiter("sliding", opt =>
    {
        opt.PermitLimit          = 100;
        opt.Window               = TimeSpan.FromMinutes(1);
        opt.SegmentsPerWindow    = 4;
        opt.QueueProcessingOrder = QueueProcessingOrder.NewestFirst;
        opt.QueueLimit           = 10;
    });

    // ③ Token Bucket: good for burst traffic
    options.AddTokenBucketLimiter("token", opt =>
    {
        opt.TokenLimit          = 20;
        opt.ReplenishmentPeriod = TimeSpan.FromSeconds(10);
        opt.TokensPerPeriod     = 5;
        opt.AutoReplenishment   = true;
    });

    // ④ Response when the limit is hit
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.Headers["Retry-After"] = "15";
        await context.HttpContext.Response.WriteAsJsonAsync(
            new { error = "Too many requests. Please retry after 15 seconds." },
            cancellationToken);
    };
});

var app = builder.Build();
app.UseRateLimiter(); // Middleware must be added to the pipeline
app.MapControllers();
app.Run();`,
      },
      {
        filename: 'Controllers/ApiController.cs',
        lang: 'csharp',
        code: `[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    // ① Apply rate limit policy cho endpoint cụ thể
    [HttpGet]
    [EnableRateLimiting("sliding")]  // Use sliding window
    public IActionResult GetAll() => Ok(/* ... */);

    // ② Sensitive login route: stricter rate limit
    [HttpPost("/api/auth/login")]
    [EnableRateLimiting("fixed")]   // Max 10 attempts / 15s
    public async Task<IActionResult> Login([FromBody] LoginDto dto) => Ok(/* ... */);

    // ③ Disable rate limiting for internal health endpoint
    [HttpGet("health")]
    [DisableRateLimiting]
    public IActionResult Health() => Ok(new { status = "healthy" });
}`,
      },
      {
        filename: 'Middleware/IpRateLimitMiddleware.cs',
        lang: 'csharp',
        code: `// Custom middleware: rate limit by IP address
public class IpRateLimitMiddleware
{
    private readonly RequestDelegate _next;
    // In-memory store (use Redis in production)
    private static readonly ConcurrentDictionary<string, (int Count, DateTime Reset)>
        _store = new();

    public IpRateLimitMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var ip    = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var now   = DateTime.UtcNow;
        var limit = 100; // requests
        var windowSecs = 60;

        _store.AddOrUpdate(ip,
            _ => (1, now.AddSeconds(windowSecs)),
            (_, existing) =>
            {
                if (now > existing.Reset)
                    return (1, now.AddSeconds(windowSecs)); // Reset window
                return (existing.Count + 1, existing.Reset);
            });

        var (count, reset) = _store[ip];
        if (count > limit)
        {
            context.Response.StatusCode = 429;
            context.Response.Headers["X-RateLimit-Limit"]     = limit.ToString();
            context.Response.Headers["X-RateLimit-Remaining"] = "0";
            context.Response.Headers["X-RateLimit-Reset"]     = reset.ToString("R");
            await context.Response.WriteAsync("Rate limit exceeded");
            return;
        }

        context.Response.Headers["X-RateLimit-Limit"]     = limit.ToString();
        context.Response.Headers["X-RateLimit-Remaining"] = (limit - count).ToString();
        await _next(context);
    }
}`,
      },
    ],
  },
  {
    id: 'validation',
    label: 'Input Validation',
    icon: FileCheck,
    color: 'emerald',
    badge: 'FluentValidation + DataAnnotations',
    description: 'Validate every input from the client on the server side. Use FluentValidation for complex rules or DataAnnotations for simple ones. Never trust data coming from the client.',
    files: [
      {
        filename: 'DTOs/CreateUserDto.cs — DataAnnotations',
        lang: 'csharp',
        code: `using System.ComponentModel.DataAnnotations;

public class CreateUserDto
{
    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, MinimumLength = 3,
        ErrorMessage = "Username must be 3–50 characters")]
    [RegularExpression(@"^[a-zA-Z0-9_]+$",
        ErrorMessage = "Only letters, numbers, and _ are allowed")]
    public string Username { get; set; } = null!;

    [Required]
    [EmailAddress(ErrorMessage = "Invalid email address")]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$",
        ErrorMessage = "Password must contain uppercase, lowercase, a digit, and a special character")]
    public string Password { get; set; } = null!;

    [Range(13, 120, ErrorMessage = "Age must be between 13 and 120")]
    public int Age { get; set; }
}`,
      },
      {
        filename: 'Validators/CreateUserValidator.cs — FluentValidation',
        lang: 'csharp',
        code: `using FluentValidation;

// dotnet add package FluentValidation.AspNetCore
public class CreateUserValidator : AbstractValidator<CreateUserDto>
{
    private readonly AppDbContext _db;
    public CreateUserValidator(AppDbContext db)
    {
        _db = db;

        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Username là bắt buộc")
            .Length(3, 50)
            .Matches(@"^[a-zA-Z0-9_]+$").WithMessage("Invalid characters")
            // Async rule: check if username is already taken
            .MustAsync(BeUniqueUsername).WithMessage("Username is already taken");

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MustAsync(BeUniqueEmail).WithMessage("Email is already registered");

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches(@"[A-Z]").WithMessage("Must contain at least one uppercase letter")
            .Matches(@"[0-9]").WithMessage("Must contain at least one digit")
            .Matches(@"[\W_]").WithMessage("Must contain at least one special character");

        RuleFor(x => x.Age)
            .InclusiveBetween(13, 120);
    }

    private async Task<bool> BeUniqueUsername(string username, CancellationToken ct)
        => !await _db.Users.AnyAsync(u => u.UserName == username, ct);

    private async Task<bool> BeUniqueEmail(string email, CancellationToken ct)
        => !await _db.Users.AnyAsync(u => u.Email == email, ct);
}`,
      },
      {
        filename: 'Controllers/UsersController.cs',
        lang: 'csharp',
        code: `[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IValidator<CreateUserDto> _validator;

    public UsersController(IValidator<CreateUserDto> validator)
        => _validator = validator;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        // ① Manually validate (or automatically if using auto-validation)
        var result = await _validator.ValidateAsync(dto);
        if (!result.IsValid)
        {
            // Return the list of specific errors
            return ValidationProblem(result.ToDictionary());
        }

        // ② Extra sanitize (prevent XSS)
        dto.Username = System.Web.HttpUtility.HtmlEncode(dto.Username);

        // ③ Never log sensitive data!
        // ❌ Wrong: _logger.LogInformation("Creating user: {dto}", dto);
        // ✅ Right: _logger.LogInformation("Creating user: {username}", dto.Username);

        // ... save to database với parameterized query (EF Core tự làm)
        return CreatedAtAction(nameof(GetById), new { id = 1 }, null);
    }
}

// ─── Register FluentValidation in Program.cs ──────────────────────────────
// builder.Services.AddFluentValidationAutoValidation();
// builder.Services.AddValidatorsFromAssemblyContaining<CreateUserValidator>();`,
      },
    ],
  },
  {
    id: 'https',
    label: 'HTTPS & Headers',
    icon: Lock,
    color: 'blue',
    badge: 'TLS / HSTS / Security Headers',
    description: 'Secure the transport layer with TLS/SSL, enforce HTTPS, and add HTTP Security Headers to protect against XSS, clickjacking, and content sniffing.',
    files: [
      {
        filename: 'Program.cs',
        lang: 'csharp',
        code: `var builder = WebApplication.CreateBuilder(args);

// ① HSTS (HTTP Strict Transport Security)
builder.Services.AddHsts(options =>
{
    options.Preload           = true;
    options.IncludeSubDomains = true;
    options.MaxAge            = TimeSpan.FromDays(365); // 1 year
});

// ② HTTPS Redirection
builder.Services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
    options.HttpsPort          = 443;
});

// ③ CORS (only allow trusted origins)
builder.Services.AddCors(options =>
{
    options.AddPolicy("TrustedOrigins", policy =>
        policy.WithOrigins("https://myapp.com", "https://admin.myapp.com")
              .AllowedMethods("GET", "POST", "PUT", "DELETE")
              .AllowedHeaders("Authorization", "Content-Type")
              .DisallowCredentials()); // Cookies don't cross CORS
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts(); // Production only (dev uses localhost)
}

app.UseHttpsRedirection(); // Redirect HTTP → HTTPS
app.UseCors("TrustedOrigins");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();`,
      },
      {
        filename: 'Middleware/SecurityHeadersMiddleware.cs',
        lang: 'csharp',
        code: `/// <summary>
/// Adds HTTP Security Headers to every response
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;
    public SecurityHeadersMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        // Prevent Clickjacking (embedding in iframes)
        headers["X-Frame-Options"] = "DENY";

        // Prevent MIME type sniffing
        headers["X-Content-Type-Options"] = "nosniff";

        // No referrer on cross-origin requests
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

        // Content Security Policy (CSP) — only run scripts from same origin
        headers["Content-Security-Policy"] =
            "default-src 'self'; " +
            "script-src 'self' 'nonce-{random}'; " +
            "style-src 'self' https://fonts.googleapis.com; " +
            "img-src 'self' data: https:; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "connect-src 'self'; " +
            "frame-ancestors 'none'";

        // Permissions Policy (disable browser APIs we don't need)
        headers["Permissions-Policy"] =
            "camera=(), microphone=(), geolocation=(), payment=()";

        // XSS Protection (legacy browsers)
        headers["X-XSS-Protection"] = "1; mode=block";

        // Hide server information
        context.Response.Headers.Remove("Server");
        context.Response.Headers.Remove("X-Powered-By");

        await _next(context);
    }
}

// ─── Register in Program.cs ──────────────────────────────────────────────
// app.UseMiddleware<SecurityHeadersMiddleware>();`,
      },
      {
        filename: 'appsettings.json',
        lang: 'json',
        code: `{
  "Jwt": {
    "Key": "SuperSecretKey_MustBe32CharsOrMore!",
    "Issuer": "https://api.myapp.com",
    "ExpireHours": 2
  },
  "ConnectionStrings": {
    "Default": "Server=...;Database=...;User Id=...;Password=..."
  },
  "RateLimit": {
    "PermitLimit": 100,
    "WindowSeconds": 60
  },
  "Kestrel": {
    "Endpoints": {
      "Http": {
        "Url": "http://+:80"
      },
      "Https": {
        "Url": "https://+:443",
        "Certificate": {
          "Path": "/certs/cert.pfx",
          "Password": "cert-password-from-secrets"
        }
      }
    }
  }
}

// ⚠ Secrets (Key, password) should use:
// - dotnet user-secrets (development)
// - Azure Key Vault / AWS Secrets Manager (production)
// - Environment variables (containers)`,
      },
    ],
  },
];

// ─── Token highlighter (simple, no external dep) ─────────────────────────────

function tokenize(code: string, lang: string): React.ReactNode[] {
  if (lang === 'json') {
    return tokenizeJson(code);
  }
  return tokenizeCSharp(code);
}

function tokenizeJson(code: string): React.ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, li) => {
    const parts: React.ReactNode[] = [];
    let last = 0;

    // Comment line //
    if (line.trimStart().startsWith('//')) {
      parts.push(<span key="c" className="text-slate-500">{line}</span>);
      return <div key={li}>{parts}<br /></div>;
    }

    const re = /("(?:[^"\\]|\\.)*")\s*:|(:\s*)("(?:[^"\\]|\\.)*")|(\bfalse\b|\btrue\b|\bnull\b)|(\d+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) parts.push(<span key={last} className="text-slate-300">{line.slice(last, m.index)}</span>);
      if (m[1]) parts.push(<span key={m.index + 'k'} className="text-blue-300">{m[1]}</span>);
      if (m[2]) parts.push(<span key={m.index + 'colon'} className="text-slate-300">{m[2]}</span>);
      if (m[3]) parts.push(<span key={m.index + 'v'} className="text-emerald-300">{m[3]}</span>);
      if (m[4]) parts.push(<span key={m.index + 'kw'} className="text-amber-300">{m[4]}</span>);
      if (m[5]) parts.push(<span key={m.index + 'n'} className="text-purple-300">{m[5]}</span>);
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(<span key={last + 'r'} className="text-slate-300">{line.slice(last)}</span>);
    return <div key={li}>{parts}<br /></div>;
  });
}

function tokenizeCSharp(code: string): React.ReactNode[] {
  const keywords = /\b(using|var|new|return|public|private|protected|internal|static|async|await|class|interface|record|struct|abstract|override|virtual|sealed|readonly|const|void|string|int|bool|double|float|decimal|long|object|null|true|false|if|else|for|foreach|while|do|switch|case|break|continue|throw|try|catch|finally|namespace|this|base|params|ref|out|in|is|as|get|set|init|and|or|not|when|with|required|Task|IActionResult)\b/g;
  const strings = /"(?:[^"\\]|\\.)*"|@"(?:[^"]|"")*"/g;
  const comments = /\/\/.*/g;
  const comments2 = /\/\*[\s\S]*?\*\//g;
  const numbers = /\b\d+(\.\d+)?\b/g;
  const attrs = /\[.*?\]/g;
  const types = /\b([A-Z][a-zA-Z0-9]*(?:<[^>]*>)?)\b/g;

  const lines = code.split('\n');
  return lines.map((line, li) => {
    // Comment line
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('///')) {
      return (
        <div key={li}>
          <span className="text-slate-500 italic">{line}</span>
          <br />
        </div>
      );
    }

    // Build token list
    interface Tok { start: number; end: number; cls: string; text: string }
    const tokens: Tok[] = [];

    const addTokens = (re: RegExp, cls: string) => {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(line)) !== null) {
        tokens.push({ start: m.index, end: m.index + m[0].length, cls, text: m[0] });
      }
    };

    addTokens(comments, 'text-slate-500 italic');
    addTokens(comments2, 'text-slate-500 italic');
    addTokens(strings, 'text-amber-300');
    addTokens(attrs, 'text-rose-300');
    addTokens(keywords, 'text-blue-400 font-bold');
    addTokens(numbers, 'text-purple-300');
    addTokens(types, 'text-emerald-300');

    // Sort and deduplicate
    tokens.sort((a, b) => a.start - b.start);
    const merged: Tok[] = [];
    let cursor = 0;
    for (const tok of tokens) {
      if (tok.start < cursor) continue;
      merged.push(tok);
      cursor = tok.end;
    }

    // Build output
    const parts: React.ReactNode[] = [];
    let last2 = 0;
    for (const tok of merged) {
      if (tok.start > last2) {
        parts.push(<span key={last2} className="text-slate-300">{line.slice(last2, tok.start)}</span>);
      }
      parts.push(<span key={tok.start} className={tok.cls}>{tok.text}</span>);
      last2 = tok.end;
    }
    if (last2 < line.length) {
      parts.push(<span key={last2 + 'r'} className="text-slate-300">{line.slice(last2)}</span>);
    }

    return <div key={li}>{parts}<br /></div>;
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-slate-200"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1 text-emerald-400">
            <Check size={11} /> Copied!
          </motion.span>
        ) : (
          <motion.span key="u" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
            <Copy size={11} /> Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

const COLOR_MAP: Record<string, { tab: string; badge: string; dot: string }> = {
  amber:  { tab: 'border-amber-500 text-amber-600 bg-amber-50',  badge: 'bg-amber-100 text-amber-700 border-amber-200',  dot: 'bg-amber-400' },
  violet: { tab: 'border-violet-500 text-violet-600 bg-violet-50', badge: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-400' },
  rose:   { tab: 'border-rose-500 text-rose-600 bg-rose-50',     badge: 'bg-rose-100 text-rose-700 border-rose-200',     dot: 'bg-rose-400' },
  emerald:{ tab: 'border-emerald-500 text-emerald-600 bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
  blue:   { tab: 'border-blue-500 text-blue-600 bg-blue-50',     badge: 'bg-blue-100 text-blue-700 border-blue-200',     dot: 'bg-blue-400' },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CSharpCodeExamples() {
  const [activeTab, setActiveTab] = useState('jwt');
  const [activeFile, setActiveFile] = useState(0);

  const tab = CODE_TABS.find(t => t.id === activeTab)!;
  const file = tab.files[activeFile];
  const colors = COLOR_MAP[tab.color];

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setActiveFile(0);
  };

  return (
    <div className="my-16">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-[10px] font-black uppercase tracking-widest border border-slate-700 mb-4 inline-flex items-center gap-2">
          <Terminal size={10} />
          C# Implementation
        </span>
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 mt-2">
          How to implement it in C# / ASP.NET Core
        </h2>
        <p className="text-slate-500 mt-2 font-medium text-sm max-w-xl mx-auto">
          Real-world, production-ready code snippets to secure your RESTful API
        </p>
      </div>

      <div className="rounded-[32px] border-2 border-slate-200 shadow-2xl overflow-hidden bg-white">
        {/* Top tab bar */}
        <div className="flex overflow-x-auto border-b-2 border-slate-100 bg-slate-50 scrollbar-hide">
          {CODE_TABS.map(t => {
            const isActive = t.id === activeTab;
            const c = COLOR_MAP[t.color];
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center gap-2 px-5 py-4 text-[11px] font-black uppercase tracking-tighter whitespace-nowrap border-b-2 transition-all flex-shrink-0
                  ${isActive ? c.tab + ' border-b-2' : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/60'}`}
              >
                <t.icon size={13} />
                {t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {/* Info bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold ${colors.badge}`}>
                <Layers size={10} />
                {tab.badge}
              </div>
              <p className="text-xs text-slate-500 font-medium flex-1 min-w-[200px]">
                {tab.description}
              </p>
            </div>

            {/* File tabs + Code panel */}
            <div className="flex min-h-[420px]" style={{ background: '#0d1117' }}>
              {/* File list sidebar */}
              <div className="flex flex-col border-r border-slate-700/60 flex-shrink-0 w-52">
                <div className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700/60 flex items-center gap-2">
                  <Code2 size={10} />
                  Files
                </div>
                {tab.files.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveFile(i)}
                    className={`text-left px-4 py-3 text-[10px] font-mono transition-colors flex items-start gap-2 border-l-2 ${
                      activeFile === i
                        ? `border-l-${tab.color}-400 bg-slate-800/70 text-slate-100`
                        : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                    }`}
                    style={activeFile === i ? { borderLeftColor: { amber: '#fbbf24', violet: '#a78bfa', rose: '#fb7185', emerald: '#34d399', blue: '#60a5fa' }[tab.color] } : {}}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${activeFile === i ? colors.dot : 'bg-slate-600'}`} />
                    <span className="leading-tight break-all">{f.filename}</span>
                  </button>
                ))}
              </div>

              {/* Code area */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Code toolbar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 ml-2">
                      {file.filename}
                    </span>
                  </div>
                  <CopyButton code={file.code} />
                </div>

                {/* Code content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${activeFile}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 overflow-auto p-5"
                  >
                    <table className="w-full border-collapse">
                      <tbody>
                        {file.code.split('\n').map((line, i) => (
                          <tr key={i} className="hover:bg-slate-800/40 group">
                            <td className="select-none text-right pr-4 text-[11px] font-mono text-slate-600 group-hover:text-slate-500 w-10 leading-6">
                              {i + 1}
                            </td>
                            <td className="font-mono text-[12px] leading-6 whitespace-pre">
                              {tokenize(line, file.lang)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Quick note */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
              <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
              <p className="text-[11px] text-slate-400 font-medium">
                <strong className="text-slate-600">Tip:</strong>{' '}
                {tab.id === 'jwt' && 'Never store the JWT secret in source code. Use dotnet user-secrets in development and Azure Key Vault or environment variables in production.'}
                {tab.id === 'authz' && 'Prefer Policies over manual role checks (if user.IsInRole) — Policies are more flexible and much easier to unit test.'}
                {tab.id === 'ratelimit' && 'In production, use a Redis-backed rate limiter (AspNetCoreRateLimit) so it works correctly when scaled across multiple instances.'}
                {tab.id === 'validation' && 'FluentValidation supports async rules (MustAsync), making it ideal for DB checks like "is this email already taken?".'}
                {tab.id === 'https' && 'Content Security Policy (CSP) is the most important header for preventing XSS. Test your CSP config with report-uri.com before deploying.'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
