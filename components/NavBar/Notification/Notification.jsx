import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Style from './Notification.module.css'
import images from '../../../img'

const Notification = ({ setNotification }) => {
  const handleItemClick = () => {
    if (setNotification) {
      setNotification(false);
    }
  };

  const notifications = [
    {
      id: 1,
      title: "New Bid",
      description: "Cosmic Cat NFT received a bid of 1.2 ETH",
      image: images.user1,
      time: "2 hours ago",
      read: false,
      link: "/author"
    },
    {
      id: 2,
      title: "Successfully Sold",
      description: "Your Crypto Punk #123 was sold for 2.5 ETH",
      image: images.user2,
      time: "5 hours ago",
      read: true,
      link: "/author"
    },
    {
      id: 3,
      title: "New Follower",
      description: "CryptoWhale is now following you",
      image: images.user3,
      time: "1 day ago",
      read: true,
      link: "/author"
    },
    {
      id: 4,
      title: "Featured Collection",
      description: "Your collection was featured on homepage",
      image: images.user4,
      time: "2 days ago",
      read: true,
      link: "/author"
    }
  ];

  return (
    <div className={Style.notification}>
      <div className={Style.notification_header}>
        <h3>Notifications</h3>
        <Link href="/notifications" className={Style.notification_header_link} onClick={handleItemClick}>
          See All
        </Link>
      </div>

      <div className={Style.notification_list}>
        {notifications.map((notification) => (
          <Link 
            href={notification.link} 
            key={notification.id}
            className={`${Style.notification_item} ${!notification.read ? Style.notification_item_unread : ''}`}
            onClick={handleItemClick}
          >
            <div className={Style.notification_item_image}>
              <Image 
                src={notification.image} 
                alt="Notification" 
                width={40} 
                height={40} 
              />
            </div>
            <div className={Style.notification_item_content}>
              <div className={Style.notification_item_title}>
                {notification.title}
              </div>
              <div className={Style.notification_item_description}>
                {notification.description}
              </div>
              <div className={Style.notification_item_time}>
                {notification.time}
              </div>
            </div>
            {!notification.read && <div className={Style.notification_unread_dot}></div>}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Notification
