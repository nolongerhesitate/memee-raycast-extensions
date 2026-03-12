import { Detail } from '@raycast/api';
import { Meme } from '../types';

type Props = {
  meme: Meme;
};


// ![](${meme.fullPath})
// https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png
export default function MemeDetail({ meme }: Props) {
  const markdown = `<img alt="${meme.name}" src="${meme.url}" />`;

  return <Detail
    markdown={markdown}
    navigationTitle={meme.name}
    metadata={
      <Detail.Metadata>
        <Detail.Metadata.Label title="Name" text={meme.name} />
        <Detail.Metadata.Label title="Path" text={meme.path} />
      </Detail.Metadata>
    }
  />;
}