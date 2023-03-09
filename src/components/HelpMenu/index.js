import { useEffect, useState } from 'react';
import helpMenuPropTypes from './HelpMenu.propTypes';
import './index.scss';
import close from './assets/close-help.svg';
import play from './assets/play.svg';
import fade from './assets/fade.svg';
import { ReactComponent as Question } from './assets/question.svg';

/*
  HelpMenu component
    title: string, required
    description: string, required, length <= 150
    video: { thumbnailSrc: string, url: string }
    guideLink: { url: string, text: string }, required
    links: [{ url: string, text: string }], length <= 5
    socials: [{ url: string, iconSrc: string }]
    appDetails: { name: string, version: string, lastUpdated: string }
*/

const HelpMenu = ({
  title,
  description,
  video,
  guideLink,
  links,
  socials,
  appDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen((state) => !state);

  useEffect(() => {
    const appHeight = () => {
      document.documentElement.style.setProperty(
        '--app-height',
        `${window.innerHeight}px`
      );
    };

    window.addEventListener('resize', appHeight);
    appHeight();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        !document.querySelector('.help').contains(e.target) &&
        !document.querySelector('.handle-help-btn').contains(e.target)
      ) {
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      window.addEventListener('mousedown', handler);
    }
    return () => {
      window.removeEventListener('mousedown', handler);
    };
  }, [isOpen]);

  return (
    <>
      <div className={`help ${isOpen ? 'help_open' : ''}`}>
        <button onClick={handleOpen} type='button' className='help__close'>
          <img src={close} alt='close help' />
        </button>
        <p className='help__title'>{title}</p>
        <p className='help__description'>{description}</p>
        {video && (
          <div className='help__video-preview'>
            <a href={video.url} target={'_blank'} rel='noreferrer'>
              <img
                className='help__preview-img'
                src={video.thumbnailSrc}
                alt={'#'}
              />
              <div className='help__play'>
                <img src={play} alt='play button' />
              </div>
            </a>
          </div>
        )}
        <a
          href={guideLink.url}
          target={'_blank'}
          className='help__academy'
          rel='noreferrer'
        >
          {guideLink.text}
        </a>
        {links && (
          <ul className='help__links'>
            {links.map(({ url, text }) => (
              <li key={text} className='help__link'>
                <a href={url} target={'_blank'} rel='noreferrer'>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        )}
        {socials && (
          <div className='help__socials'>
            {socials.map(({ url, iconSrc }) => (
              <a
                className='help__social'
                key={url}
                target='_blank'
                href={url}
                rel='noreferrer'
              >
                <img src={iconSrc} alt='twitter' />
              </a>
            ))}
          </div>
        )}
        {appDetails && (
          <p className='help__footer'>
            {appDetails.name} {appDetails.version}
            <br />
            {appDetails.lastUpdated}
          </p>
        )}
      </div>
      <div
        className={`handle-help-fade ${
          isOpen ? 'handle-help-fade_active' : ''
        }`}
      >
        <img src={fade} alt='help fade' />
      </div>
      <button
        type='button'
        onClick={handleOpen}
        className={`handle-help-btn ${isOpen ? 'handle-help-btn_active' : ''}`}
      >
        <Question />
      </button>
    </>
  );
};

HelpMenu.propTypes = helpMenuPropTypes;

export default HelpMenu;
