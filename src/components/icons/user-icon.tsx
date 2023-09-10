import React, {
  ReactElement,
  memo,
  CSSProperties
} from "react";

const UserIcon = (props: { style?: CSSProperties }): ReactElement => {

  return (
    <svg
      className="svg-icon__default-user"
      style={ props.style }
      viewBox="0 0 512 512">
      <path
        d="M256,0c-65.733,0-119.211,53.479-119.211,119.211S190.267,238.423,256,238.423s119.211-53.479,119.211-119.211
			S321.733,0,256,0z M256,218.024c-54.486,0-98.813-44.328-98.813-98.813S201.515,20.398,256,20.398s98.813,44.328,98.813,98.813
			S310.485,218.024,256,218.024z"/>
      <path
        d="M426.272,331.529c-45.48-45.48-105.952-70.529-170.272-70.529c-64.32,0-124.791,25.047-170.273,70.529
			c-45.48,45.48-70.529,105.952-70.529,170.272c0,5.632,4.566,10.199,10.199,10.199h461.204c5.632,0,10.199-4.567,10.199-10.199
			C496.801,437.482,471.752,377.01,426.272,331.529z M35.831,491.602C41.179,374.789,137.889,281.398,256,281.398
			s214.821,93.391,220.17,210.204H35.831z"/>
      <path
        d="M182.644,457.944H66.295c-5.633,0-10.199,4.567-10.199,10.199s4.566,10.199,10.199,10.199h116.349
			c5.633,0,10.199-4.567,10.199-10.199S188.277,457.944,182.644,457.944z"/>
      <path
        d="M225.621,457.944h-7.337c-5.633,0-10.199,4.567-10.199,10.199s4.566,10.199,10.199,10.199h7.337
			c5.633,0,10.199-4.567,10.199-10.199S231.254,457.944,225.621,457.944z"/>
    </svg>
  );
};

export default memo(UserIcon);
