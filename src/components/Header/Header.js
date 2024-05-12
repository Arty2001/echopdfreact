import React from 'react';
import styles from './Header.module.css'; // Import CSS module for styling

const Header = () => {
  return (
    <div className={styles.header}>
      <span className={styles.echo}>ECHO</span><span className={styles.pdf}>PDF</span>
    </div>
  );
};

export default Header;
