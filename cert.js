import fs from "fs";
import { createCA, createCert } from "mkcert";

async function generateCertificates() {
  const ca = await createCA({
    organization: "Hello CA",
    countryCode: "NP",
    state: "Bagmati",
    locality: "Kathmandu",
    validity: 365
  });

  const cert = await createCert({
    ca: { key: ca.key, cert: ca.cert },
    domains: ["127.0.0.1", "localhost"],
    validity: 365
  });

  // Save the CA certificate and private key
  fs.writeFileSync("ca-cert.pem", ca.cert);
  fs.writeFileSync("ca-key.pem", ca.key);

  // Save the server certificate and private key
  fs.writeFileSync("server-cert.pem", cert.cert);
  fs.writeFileSync("server-key.pem", cert.key);

  console.log("Certificates generated and saved to files.");
}

generateCertificates();
