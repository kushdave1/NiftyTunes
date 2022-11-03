import React from "react";
import PropTypes from "prop-types";


function YoutubeEmbed({ embedId }) {
    return (
    <iframe
      width="100%"
      height="760px"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      gesture="media"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
      style={{position: "absolute", top: "70px", zIndex: 2 }}
    />
    )
};

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default YoutubeEmbed;

