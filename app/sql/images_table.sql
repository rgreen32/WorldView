CREATE TABLE Images(
    image varchar(255) UNIQUE,
    full_image varchar(255), 
    location varchar(255), 
    lat float, 
    lng float, 
    userName varchar(255), 
    portfolio varchar(255), 
    unsplash_profile varchar(255),
    image_id varchar(255),
    disabled integer DEFAULT 0)