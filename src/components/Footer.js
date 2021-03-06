import React from 'react';

import Container from 'components/Container';

const Footer = () => {
  return (
    <footer>
      <Container>
        <p>&copy; { new Date().getFullYear() }, Natalie & Hamidreza Final Project for Heritage College</p>
      </Container>
    </footer>
  );
};

export default Footer;
