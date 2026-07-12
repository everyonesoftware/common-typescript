import fs from "node:fs/promises";
import path from "node:path";

const directories: string[] = [
    "sources",
    // "tests",
];

async function generateBarrel(directory: string): Promise<void>
{
    const absoluteDir = path.resolve(directory);

    await generateBarrelRecursive(absoluteDir);
}

async function generateBarrelRecursive(directory: string): Promise<void>
{
    const entries = await fs.readdir(directory, { withFileTypes: true });

    const exports: string[] = [];

    for (const entry of entries)
    {
        const fullPath = path.join(directory, entry.name);

        if (entry.isDirectory())
        {
            // Generate a barrel for the subdirectory first
            await generateBarrelRecursive(fullPath);

            const relative: string = `./${entry.name}/index.js`;
            exports.push(`export * from "${relative}";`);
            continue;
        }

        if (!entry.name.endsWith(".ts"))
        {
            continue;
        }

        if (entry.name === "index.ts")
        {
            continue;
        }

        const baseName: string = entry.name.replace(/\.ts$/, "");

        exports.push(`export * from "./${baseName}.js";`);
    }

    exports.sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    const contents =
        exports.length > 0
            ? exports.join("\n") + "\n"
            : "";

    const indexPath = path.join(directory, "index.ts");

    await fs.writeFile(indexPath, contents, "utf8");

    console.log(`Generated ${path.relative(process.cwd(), indexPath)}`);
}

for (const directory of directories)
{
    await generateBarrel(directory);
}

console.log("Done!");