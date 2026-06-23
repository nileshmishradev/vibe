# You can use most Debian-based base images
FROM node:21-slim

# Install curl
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/user

RUN npx --yes create-next-app@16.0.0 . --yes

RUN npx --yes shadcn@2.7.0 init --yes -b neutral --force
RUN npx --yes shadcn@2.7.0 add --all --yes

# Install necessary animation and utility packages
RUN npm install clsx tailwind-merge tw-animate-css

RUN mkdir -p /home/user/lib

# Create the utils.ts file with the `cn` function in the correct location
RUN printf 'import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs))\n}\n' > /home/user/lib/utils.ts


