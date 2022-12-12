import { useEffect, useState } from 'react';
import { usePrismicPageData } from '../usePrismicPageData';
import { Logo } from '../assets/Logo';
import { Close } from '../assets/Close';
import { Menu } from '../assets/Menu';
import AddressBlock from './AddressBlock';
import { Wallet } from '../assets/Wallet';
import { LearnMoreBtn } from '../assets/LearnMoreBtn';
import Submenu from './Submenu';

const MenuBody = ({
  address,
  login,
  logout,
  connector,
  initHidden,
  customLogo,
}) => {
  const [isOpen, setIsOpen] = useState(
    initHidden ? false : window.innerWidth > 1050
  );

  const [overlayVisible, setOverlayVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 430) {
        setIsOpen(initHidden ? false : window.innerWidth > 1050);
        setOverlayVisible(false);
      }
    };
    window.addEventListener('resize', handleResize, true);
  }, []);

  const handleOpen = () => {
    setOverlayVisible(!isOpen && window.innerWidth < 1050);
    setIsOpen((state) => !state);
  };

  const { href } = window.location;
  let currentApp = '';

  if (href.includes('staking')) {
    currentApp = 'staking';
  } else if (href.includes('explorer')) {
    currentApp = 'explorer';
  } else if (href.includes('firepot')) {
    currentApp = 'firepot';
  } else if (href.includes('bridge')) {
    currentApp = 'bridge';
  }

  const data = usePrismicPageData('menu');
  return (
    <>
      {overlayVisible && <div onClick={handleOpen} className='menu-overlay' />}
      <div className='side-menu-container'>
        <div className={`side-menu${isOpen ? ' side-menu_expanded' : ''}`}>
          <div className='side-menu__mobile-wrapper'>
            <div className='side-menu__logo'>
              <a href='/'>
                {customLogo || (
                  <>
                    <Logo />
                  </>
                )}
              </a>
            </div>
            <button
              type='button'
              onClick={handleOpen}
              className='side-menu__hamburger'
            >
              {isOpen ? <Close /> : <Menu />}
            </button>
          </div>
          {isOpen && (
            <>
              <div className='side-menu__content'>
                {address ? (
                  <AddressBlock {...{ address, logout, connector }} />
                ) : (
                  <>
                    <button
                      type='button'
                      className='side-menu__connect-wallet'
                      onClick={login}
                    >
                      <Wallet />
                      Connect wallet
                    </button>

                    <div className='side-menu__connect-text'>
                      Your AirDAO experience will be limited without connecting
                    </div>
                  </>
                )}
                <div className='side-menu__nav-wrapper'>
                  <div className='side-menu__content-list'>
                    <ul className='side-menu__list'>
                      {data?.links.map(
                        ({ name, link, guide_link, isdisabled }) =>
                          !isdisabled ? (
                            <li key={name}>
                              <a
                                className={`side-menu__list-link${
                                  currentApp === link.type
                                    ? 'side-menu__list-link_active'
                                    : ''
                                }`}
                                href={link.url}
                              >
                                {name}
                                {guide_link.url && currentApp === link.type && (
                                  <a
                                    href={guide_link.url}
                                    target={guide_link.target}
                                  >
                                    <LearnMoreBtn />
                                  </a>
                                )}
                              </a>
                            </li>
                          ) : (
                            <li key={name} className='side-menu__list-vote'>
                              <span>{name}</span>
                              <span>Coming Soon</span>
                            </li>
                          )
                      )}
                    </ul>
                  </div>

                  {data?.body.map((submenu) => (
                    <Submenu key={submenu?.id} submenu={submenu} />
                  ))}

                  <div>
                    <ul className=' side-menu__list_socials filter-green'>
                      {data?.socials.map(({ icon, link }) => (
                        <li key={link.url}>
                          <a
                            rel='nofollow'
                            href={link.url}
                            target={link.target}
                            className='side-menu__list_socials-item'
                          >
                            <img
                              src={icon.url}
                              alt={icon.alt}
                              className='side-menu__list_socials-icon'
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuBody;
