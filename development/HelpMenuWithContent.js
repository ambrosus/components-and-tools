import { HelpMenu } from '../dist/components';

const helpContent = {
  title: 'AirDao Bridge',
  description:
    'The AirDAO Bridge enables you to transfer crypto tokens between the AMB blockchain, Ethereum blockchain (ETH), and BNB Smart Chain (BSC).',
  video: {
    url: 'https://airdao.academy/guides/bridge-guide',
    thumbnailSrc: 'https://cataas.com/cat?width=1280&height=720',
  },
  guideLink: {
    text: 'Go to AirDAO Academy →',
    url: 'https://airdao.academy/guides/bridge',
  },
  links: [
    {
      text: 'Help Center',
      url: 'https://airdao.academy/',
    },
    {
      text: 'Whats New',
      url: 'https://airdao.academy/change-log',
    },
    {
      text: 'Place Feedback & Report Bugs',
      url: 'https://forms.gle/vRqhvT5pLAFic7Z77',
    },
    {
      text: 'Governance',
      url: 'https://community.airdao.io/',
    },
    {
      text: 'Github',
      url: 'https://github.com/ambrosus/',
    },
  ],
  socials: [
    {
      url: 'https://twitter.com/airdao_io',
      iconSrc:
        'https://airdao.cdn.prismic.io/airdao/5e3435fb-0f14-4f6f-91da-1587da93ec02_twitter-icon.svg',
    },
    {
      url: 'https://t.me/airDAO_official',
      iconSrc:
        'https://airdao.cdn.prismic.io/airdao/5e3435fb-0f14-4f6f-91da-1587da93ec02_twitter-icon.svg',
    },
    {
      url: 'https://www.reddit.com/r/AirDAO/',
      iconSrc:
        'https://airdao.cdn.prismic.io/airdao/5e3435fb-0f14-4f6f-91da-1587da93ec02_twitter-icon.svg',
    },
    {
      url: 'https://blog.airdao.io/',
      iconSrc:
        'https://airdao.cdn.prismic.io/airdao/5e3435fb-0f14-4f6f-91da-1587da93ec02_twitter-icon.svg',
    },
    {
      url: 'https://discord.com/invite/hnftmSjUr8',
      iconSrc:
        'https://airdao.cdn.prismic.io/airdao/5e3435fb-0f14-4f6f-91da-1587da93ec02_twitter-icon.svg',
    },
  ],
};

const HelpMenuWithContent = () => {
  return <HelpMenu {...helpContent} />;
};

export default HelpMenuWithContent;
