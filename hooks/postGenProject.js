import fs from "fs";
import path from "path";

console.log("{{projectName}}");
const projectPath = path.resolve("{{projectSlug}}");

fs.mkdirSync(path.join(projectPath, "src"));
fs.writeFileSync(path.join(projectPath, "hooks.txt"), "{{projectName}}");
