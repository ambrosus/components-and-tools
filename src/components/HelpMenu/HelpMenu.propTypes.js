import PropTypes from 'prop-types';

const titleType = PropTypes.string.isRequired;

const descriptionTypeChecker = ({ description }) => {
  const error = Error(
    'description is required and must be a string with length <= 150'
  );

  if (typeof description !== 'string') return error;
  if (description.length > 150 || description.length === 0) return error;

  return null;
};

const videoType = PropTypes.shape({
  thumbnailSrc: PropTypes.string,
  url: PropTypes.string,
});

const guideLinkType = PropTypes.shape({
  url: PropTypes.string,
  text: PropTypes.string,
}).isRequired;

const linksTypeChecker = ({ links }) => {
  const error = Error(
    'links must be an array of objects with properties url and text with length <= 5'
  );

  if (!Array.isArray(links)) return error;
  if (links.length > 5) return error;
  if (
    !links.every(
      (prop) =>
        typeof prop === 'object' &&
        typeof prop.url === 'string' &&
        typeof prop.text === 'string'
    )
  ) {
    return error;
  }

  return null;
};

const socialsType = PropTypes.arrayOf(
  PropTypes.shape({
    url: PropTypes.string,
    iconSrc: PropTypes.string,
  })
);

const appDetailsType = PropTypes.shape({
  name: PropTypes.string,
  version: PropTypes.string,
  lastUpdated: PropTypes.string,
});

const helpMenuPropTypes = {
  title: titleType,
  description: descriptionTypeChecker,
  guideLink: guideLinkType,
  video: videoType,
  links: linksTypeChecker,
  socials: socialsType,
  appDetails: appDetailsType,
};

export default helpMenuPropTypes;
