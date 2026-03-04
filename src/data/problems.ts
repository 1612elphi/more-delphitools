export interface Problem {
  slug: string;
  label: string;
  project: string;
  colors: {
    bg: string;
    text: string;
    accent: string;
  };
}

// Color palettes per project
const palette = {
  bespoke:      { bg: '#420D07', text: '#F5C98E', accent: '#F5C98E' },
  cassini:      { bg: '#0d1b2a', text: '#e0e0e0', accent: '#48cae4' },
  camera:       { bg: '#1a0d2e', text: '#e0e0e0', accent: '#f472b6' },
  components:   { bg: '#0a192f', text: '#e0e0e0', accent: '#64ffda' },
  delphitools:  { bg: '#0f150f', text: '#e8dcc8', accent: '#8a9a68' },
  envy:         { bg: '#1a0a2e', text: '#e0e0e0', accent: '#bb86fc' },
  exhentai:     { bg: '#2e1a1a', text: '#f0e0e0', accent: '#f87171' },
  grimoire:     { bg: '#2a2320', text: '#e8e0d4', accent: '#c4b5fd' },
  llkav:        { bg: '#1a1a1a', text: '#ffffff', accent: '#e53935' },
  morelater:    { bg: '#f5f3ef', text: '#1a1a1a', accent: '#e53935' },
  nomicron:     { bg: '#000000', text: '#ffffff', accent: '#fb7185' },
  pictoclash:   { bg: '#0a0a0a', text: '#ffffff', accent: '#a3e635' },
  pigs:         { bg: '#000000', text: '#ffffff', accent: '#ff8c00' },
  pocketpigs:   { bg: '#000000', text: '#ffffff', accent: '#ff8c00' },
  primm:        { bg: '#1a1a1a', text: '#e0e0e0', accent: '#f97316' },
  siding:       { bg: '#201c1a', text: '#e0dcd6', accent: '#c13028' },
  taxiway:      { bg: '#0d0c0a', text: '#e8dcc8', accent: '#d4a843' },
} as const;

export const problems: Problem[] = [
  // --- BESPOKE (default) ---
  { slug: 'bespoke', label: 'i need to solve this very specific problem only i care about', project: 'delphitools', colors: palette.bespoke },

  // --- CASSINI ---
  { slug: 'cassini', label: 'procreate is too bougie for me', project: 'cassini', colors: palette.cassini },
  { slug: 'cassini', label: "my ipad doesn't have ms paint", project: 'cassini', colors: palette.cassini },
  { slug: 'cassini', label: 'i hate having a colour wheel', project: 'cassini', colors: palette.cassini },
  { slug: 'cassini', label: "i want the op-1 but can't play piano", project: 'cassini', colors: palette.cassini },

  // --- CASSINI CAMERA ---
  { slug: 'cassini-camera', label: 'i want colour science worse than sony', project: 'cassini camera', colors: palette.camera },
  { slug: 'cassini-camera', label: "i can't afford the sigma bf", project: 'cassini camera', colors: palette.camera },
  { slug: 'cassini-camera', label: 'i want to play around with limited colours', project: 'cassini camera', colors: palette.camera },
  { slug: 'cassini-camera', label: 'blocking colours is hard for me', project: 'cassini camera', colors: palette.camera },

  // --- DELPHICOMPONENTS ---
  { slug: 'delphicomponents', label: "i want that fun progress ring from linear but nobody is making that as a react component", project: 'delphicomponents', colors: palette.components },

  // --- DELPHITOOLS ---
  { slug: 'convert-image', label: 'i need to convert an image', project: 'delphitools', colors: palette.delphitools },
  { slug: 'qr-codes', label: 'i need to make qr codes', project: 'delphitools', colors: palette.delphitools },
  { slug: 'colour-palettes', label: 'i want cool colour palettes', project: 'delphitools', colors: palette.delphitools },
  { slug: 'png-lied', label: 'this png lied to me', project: 'delphitools', colors: palette.delphitools },
  { slug: 'watermark', label: 'my art needs to be watermarked', project: 'delphitools', colors: palette.delphitools },
  { slug: 'cant-pick-colours', label: "i can't be bothered to come up with colours", project: 'delphitools', colors: palette.delphitools },
  { slug: 'nobody-can-read', label: 'nobody can read my text', project: 'delphitools', colors: palette.delphitools },
  { slug: 'sick-svgs', label: 'my svgs are sick, please, my svgs', project: 'delphitools', colors: palette.delphitools },
  { slug: 'letter-paper', label: 'i forgot how big letter paper is', project: 'delphitools', colors: palette.delphitools },
  { slug: 'meta-tags', label: 'i need some meta tags', project: 'delphitools', colors: palette.delphitools },
  { slug: 'regex-blows', label: 'my regex blows', project: 'delphitools', colors: palette.delphitools },
  { slug: 'date-line-meeting', label: 'i have a friend on the date line and need find the time for a meeting', project: 'delphitools', colors: palette.delphitools },

  // --- ENVY ---
  { slug: 'envy', label: 'i want to watch videos on the big screen', project: 'envy', colors: palette.envy },
  { slug: 'envy', label: 'i say "shut the fuck up" when i see a youtube ad', project: 'envy', colors: palette.envy },

  // --- EXHENTAI-DOWNLOADER ---
  { slug: 'exhentai-downloader', label: 'i want to read smut on my kindle', project: 'exhentai-downloader', colors: palette.exhentai },

  // --- KIRBY GRIMOIRE ---
  { slug: 'kirby-grimoire', label: 'i need to publish a webcomic but all the offerings suck', project: 'kirby grimoire', colors: palette.grimoire },
  { slug: 'kirby-grimoire', label: 'i wanna show people my writing in a beautiful way', project: 'kirby grimoire', colors: palette.grimoire },

  // --- LLKA-V ---
  { slug: 'llka-v', label: 'i run a library of things and our computers suck', project: 'llka-v', colors: palette.llkav },

  // --- MORE LATER ---
  { slug: 'more-later', label: 'i need to plan social media stuff and i work visually', project: 'more later', colors: palette.morelater },
  { slug: 'more-later', label: "i can't stand current social media planning tools", project: 'more later', colors: palette.morelater },

  // --- NOMICRON ---
  { slug: 'nomicron', label: 'i want my friends to hate me', project: 'nomicron', colors: palette.nomicron },
  { slug: 'nomicron', label: 'i want my friends to sorta dislike me', project: 'nomicron', colors: palette.nomicron },
  { slug: 'nomicron', label: 'i want my friends to owe me like £10', project: 'nomicron', colors: palette.nomicron },

  // --- PICTOCLASH ---
  { slug: 'pictoclash', label: 'nobody draws my OCs', project: 'pictoclash', colors: palette.pictoclash },
  { slug: 'pictoclash', label: "i'm still waiting for art fight to load", project: 'pictoclash', colors: palette.pictoclash },

  // --- PIGS ---
  { slug: 'pigs', label: 'all calculators suck forever and always except this one haha anyways nimbasa city: partly clou', project: 'pigs', colors: palette.pigs },
  { slug: 'pigs', label: 'have you seen my calculator', project: 'pigs', colors: palette.pigs },
  { slug: 'pigs', label: "what am i gonna do with all these numbers", project: 'pigs', colors: palette.pigs },

  // --- POCKETPIGS ---
  { slug: 'pocketpigs', label: "the best calculator ever isn't in my pocket", project: 'pocketpigs', colors: palette.pocketpigs },
  { slug: 'pocketpigs', label: 'i want to seem cool and mysterious while minmaxing my budget in the grocery store', project: 'pocketpigs', colors: palette.pocketpigs },
  { slug: 'pocketpigs', label: "i can hardly carry that thing around can i", project: 'pocketpigs', colors: palette.pocketpigs },

  // --- PRIMM ---
  { slug: 'primm', label: 'i run a print shop and i still mourn the death of wunderlist', project: 'primm', colors: palette.primm },
  { slug: 'primm', label: 'microsoft to do might be plotting against me', project: 'primm', colors: palette.primm },

  // --- SIDING ---
  { slug: 'siding', label: "i'm autistic", project: 'siding', colors: palette.siding },
  { slug: 'siding', label: 'i like to train spot', project: 'siding', colors: palette.siding },

  // --- EMOTIONAL SUPPORT ---
  { slug: 'dad-doesnt-love-me', label: "my dad doesn't love me", project: 'emotional support', colors: palette.bespoke },
  { slug: 'squirrel-recognises-me', label: "there's a squirrel at the park who seems to recognise me", project: 'emotional support', colors: palette.bespoke },
  { slug: 'putting-off-laundry', label: "i've been putting off my laundry for two weeks", project: 'emotional support', colors: palette.bespoke },
  { slug: 'spider-in-bathroom', label: "there's a spider in my bathroom", project: 'emotional support', colors: palette.bespoke },
  { slug: 'burnt-toast-again', label: 'i burnt my toast again', project: 'emotional support', colors: palette.bespoke },

  // --- TAXIWAY ---
  { slug: 'taxiway', label: 'i refuse to give adobe more money', project: 'taxiway', colors: palette.taxiway },
  { slug: 'taxiway', label: 'enfocus can **** ** **** ******** ***', project: 'taxiway', colors: palette.taxiway },
  { slug: 'taxiway', label: "i don't trust this pdf", project: 'taxiway', colors: palette.taxiway },
];
