import { BinaryToTextEncoding, createHash } from "crypto";
import { createReadStream } from "fs-extra";

/** Calculate the SHA256 checksum of a file at the given path. Returns the checksum as a string in the specified encoding (default is hex). */
export async function getSHA256ForFile(
  filePath: string,
  encoding: BinaryToTextEncoding = "hex",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);

    stream.on("data", (data) => {
      hash.update(data);
    });

    stream.on("end", () => {
      const checksum = hash.digest(encoding);
      resolve(checksum);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}
