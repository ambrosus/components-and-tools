import { useEffect, useState } from 'react';
import helpMenuPropTypes from './HelpMenu.propTypes';
import './index.scss';
import close from './assets/close-help.svg';
import { ReactComponent as Question } from './assets/question.svg';

/*
  HelpMenu component
    title: string, required
    description: string, required, length <= 150
    video: { thumbnailSrc: string, url: string }
    guideLink: { url: string, text: string }, required
    links: [{ url: string, text: string }], length <= 5
    socials: [{ url: string, iconSrc: string }]
*/

const HelpMenu = ({ title, description, video, guideLink, links, socials }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen((state) => !state);

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
              <img src={video.thumbnailSrc} alt={'#'} />
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
        <div className='help__hr' />
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
        <div className='help__hr' />
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
        <div className='help__hr' />
        <p className='help__footer'>
          AirDAO version V0.2
          <br />
          Updated 2 days ago
        </p>
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
