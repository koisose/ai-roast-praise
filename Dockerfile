# Start of Selection
# Use the official Node.js image as the base image
FROM node:18.17.0

# Set the working directory
WORKDIR /app
ENV NEYNAR ""
ENV QUIRREL_TOKEN ""
ENV QUIRREL_BASE_URL ""
ENV QUIRREL_ENCRYPTION_SECRET ""
ENV QUIRREL_API_URL ""
ENV MONGO ""
ENV BROWSERLESS ""
ENV MINIO_ENDPOINT ""
ENV MINIO_ACCESS_KEY ""
ENV MINIO_SECRET_KEY ""
ENV MINIO_URL ""
ENV SIGNER ""
ENV FID ""
ENV NEXT_PUBLIC_IGNORE_BUILD_ERROR "true"
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
# End of Selection
