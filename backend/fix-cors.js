import fs from "fs";
import path from "path";

const serverPath = path.join(process.cwd(), "server.js");
const backupPath = path.join(process.cwd(), "server.backup-before-cors-fix.js");

if (!fs.existsSync(serverPath)) {
  console.error("❌ server.js not found. Run this file inside the backend folder.");
  process.exit(1);
}

let code = fs.readFileSync(serverPath, "utf8");

if (!code.includes('import cors from "cors";') && !code.includes("import cors from 'cors';")) {
  code = code.replace(
    /import express from ["']express["'];/,
    `import express from "express";\nimport cors from "cors";`
  );
}

const newCorsBlock = `const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://style-nexa-ai.vercel.app",
  "https://turtlemod.vercel.app",
  "https://style-nexa-71sodicgu-bragadish-v-s-projects.vercel.app",
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(",").map((item) => item.trim()));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowedOrigin = allowedOrigins.includes(origin);

      const isUserVercelPreview =
        origin.endsWith(".vercel.app") &&
        (
          origin.includes("bragadish-v-s-projects") ||
          origin.includes("turtlemod") ||
          origin.includes("style-nexa")
        );

      if (isAllowedOrigin || isUserVercelPreview) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked for origin:", origin);
      return callback(new Error(\`CORS blocked for origin: \${origin}\`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
`;

function replaceCorsBlock(source) {
  const jsonMarker = "app.use(express.json";
  const jsonIndex = source.indexOf(jsonMarker);

  if (jsonIndex === -1) {
    throw new Error("Could not find app.use(express.json...). Please share your server.js if this happens.");
  }

  const allowedStart = source.indexOf("const allowedOrigins = [");

  if (allowedStart !== -1 && allowedStart < jsonIndex) {
    return source.slice(0, allowedStart) + newCorsBlock + "\n" + source.slice(jsonIndex);
  }

  const simpleCorsStart = source.indexOf("app.use(cors(");

  if (simpleCorsStart !== -1 && simpleCorsStart < jsonIndex) {
    return source.slice(0, simpleCorsStart) + newCorsBlock + "\n" + source.slice(jsonIndex);
  }

  return source.slice(0, jsonIndex) + newCorsBlock + "\n" + source.slice(jsonIndex);
}

try {
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, code, "utf8");
    console.log("✅ Backup created:", backupPath);
  } else {
    console.log("ℹ️ Backup already exists:", backupPath);
  }

  const updatedCode = replaceCorsBlock(code);

  fs.writeFileSync(serverPath, updatedCode, "utf8");

  console.log("✅ CORS fixed successfully in server.js");
  console.log("✅ Allowed live frontend: https://turtlemod.vercel.app");
  console.log("✅ Allowed preview frontend: https://style-nexa-71sodicgu-bragadish-v-s-projects.vercel.app");
} catch (error) {
  console.error("❌ Failed to update CORS:", error.message);
  process.exit(1);
}