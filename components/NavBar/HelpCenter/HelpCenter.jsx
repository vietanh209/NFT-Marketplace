import React from 'react';
import Link from 'next/link';
import Style from './HelpCenter.module.css';

const HelpCenter = ({ setHelp }) => {
  const handleItemClick = () => {
    if (setHelp) {
      setHelp(false);
    }
  };

  const helpCenterItems = [
    {
      name: "About",
      link: "about",
      description: "Learn about our marketplace"
    },
    {
      name: "Contact Us",
      link: "contactus",
      description: "Get in touch with our team"
    },
    {
      name: "FAQ",
      link: "faq",
      description: "Frequently asked questions"
    },
    {
      name: "Sign Up",
      link: "sign-up",
      description: "Create a new account"
    },
    {
      name: "Sign In",
      link: "sign-in",
      description: "Access your account"
    },
    {
      name: "Subscription",
      link: "subscription",
      description: "Manage your subscription"
    },
  ];
  
  return (
    <div className={Style.helpCenter}>
      <div className={Style.menu}>
        {helpCenterItems.map((item, i) => (
          <Link 
            href={{ pathname: `${item.link}` }}
            className={Style.link}
            key={i + 1}
            onClick={handleItemClick}
          >
            <div className={Style.item}>
              <span className={Style.itemName}>{item.name}</span>
              <span className={Style.itemDescription}>{item.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;