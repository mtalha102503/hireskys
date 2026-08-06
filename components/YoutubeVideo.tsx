'use client'; 

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
// @ts-ignore
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

export default function YoutubeVideo({ id, title }: { id: string; title: string }) {
  return (
    <LiteYouTubeEmbed 
      id={id} 
      title={title}
      poster="hqdefault" 
      noCookie={true} 
    />
  );
}