import React from 'react';
import ReactDOM from 'react-dom';
import '@styles/styles.css';
import '@styles/less-styles.less';
import '@styles/scss-styles.scss';
import './babel';

import * as jquery from 'jquery';
import json from './assets/json'; // without .json (extentions)
import image from './assets/webpack-logo.png';
import xml from './assets/data.xml';
import csv from './assets/data.csv';
import user_ts from './user.ts';
import ReactApp from './react-component';

ReactDOM.render(<ReactApp />, document.getElementById('react-root'));

const importedFiles = {
  json,
  image,
  xml,
  csv,
  jquery,
  user_ts,
};

console.log(importedFiles);
