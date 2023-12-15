import { NFTStorage, File } from "nft.storage";
import { kebabCase } from "lodash";

export class NFTStorageClient {
  token: string;
  client: NFTStorage;

  constructor({ token }: { token: string }) {
    this.token = token;
    this.client = new NFTStorage({ token: token });
  }

  async storeImageFromUrl({
    name,
    description,
    imageUrl,
  }: {
    name: string;
    description: string;
    imageUrl: string;
  }): Promise<string> {
    const slugifiedName = kebabCase(name);
    const fileType = "image/jpeg"; // onl support jpeg

    // get data from file
    const blob = await (await fetch(imageUrl)).blob();

    const metadata = await this.client.store({
      name: name,
      description: description,
      image: new File([blob], `${slugifiedName}.jpg`, {
        type: fileType,
      }),
    });

    return metadata.url;
  }

  async store({
    name,
    description,
    imageFile,
  }: {
    name: string;
    description: string;
    imageFile: File;
  }): Promise<string> {
    const slugifiedName = kebabCase(name);

    // get data from file
    const blob = new Blob([imageFile], { type: imageFile.type });

    const metadata = await this.client.store({
      name: name,
      description: description,
      // TODO: change extension based on type
      image: new File([blob], `${slugifiedName}.jpg`, {
        type: imageFile.type,
      }),
    });

    return metadata.url;
  }
}
