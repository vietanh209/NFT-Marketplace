import React, {useState, useEffect, useContext} from "react";
import {Image} from "@nextui-org/react";
import NextImage from "next/image";
//INTERNAL IMPORT
import Style from "./HeroSection.module.css"
// import { Button } from "../componentsindex";
import images from "../../img"
import { useRouter } from "next/router";
import { Button } from '@nextui-org/button'
import {Time} from "@internationalized/date";
import {TimeInput} from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter, Avatar, Link} from "@nextui-org/react";
// theme 
import ThemeSwitcherText from "../theme/ThemeSwitcherText";
//Smart contract 
const HeroSection = () => {
    const [isFollowed, setIsFollowed] = React.useState(false);
    const router = useRouter();
    return (
    <div className={Style.heroSection}>
        <ThemeSwitcherText>
            <div className={Style.heroSection_box}>
                <div className={Style.heroSection_box_left}>
                    <div>
                        <h1>Discover, collect, and sell NFTS 🖼</h1>
                        <p>A place with endless fun and the most engaging community</p>
                    </div>
                    <Button onClick={() => router.push('/NFTPage')} color="primary" variant="bordered" 
                    >Start your search</Button>
                    <div className="flex item-center justify-between gap-10">
                        <div className="flex flex-col item-center m-5">
                            <div className="bg-white rounded-xl">
                            <Image
                            isBlurred
                            width={240}
                            height={240}
                            src="https://i2.seadn.io/ethereum/0xc4973de5ee925b8219f1e74559fb217a8e355ecf/9c1d16e3e1c0c727dcfed9a7a15fb9/b79c1d16e3e1c0c727dcfed9a7a15fb9.png"
                            alt="NextUI Album Cover"
                            className=" max-w-[240px] min-h-[100px] no-bl-br-radius"
                            />
                            <div className="bg-white text-gray-800 rounded-b-lg shadow-md p-2 no-bl-br-radius">
                                <h2 className="text-2xl font-semibold mb-2">Gaming</h2>
                                <p className="text-lg">Welcome to the airdrop!</p>
                            </div>
                            </div>
                        </div>
                        <div className="flex flex-col item-center">
                            <div>
                                <div className="flex gap-4  item-center">
                                    <TimeInput label="Start Time" />
                                    <TimeInput label="End Time" defaultValue={new Time(11, 45)} />
                                </div>
                            </div>
                            <div className="flex p-3 m-3 item-center justify-between">
                            <Card className="min-w-[250px]">
                                <CardHeader className="justify-between">
                                    <div className="flex gap-5">
                                    <Avatar isBordered radius="full" size="md" src="https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/312640198_1189701841620105_4648486811367013179_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF2p3Mvq8PEbGQA8Z2eWnIIKXU_hR1PW2ApdT-FHU9bYIKMa4OcZ0ZAEhzvPX4NE-ybDROeT2Bu4dFr91f-cZAi&_nc_ohc=tp3hGb6CavgQ7kNvwGX2OiN&_nc_oc=Adkspea2U_qDzQDThoRvuvWpkO56doJOByThNVH3uBNsb6N2pMB0knzej70pew0-j80&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&_nc_gid=mOkkhwP9_D_GGCSzD-HIbw&oh=00_AfMvAxDovQQa__Ce30slIATP7XDbb9rdgB6cwAdEkd1YMQ&oe=6869612E" />
                                    <div className="flex flex-col gap-1 items-start justify-center">
                                        <h4 className="text-small font-semibold leading-none text-default-600">Việt Anh</h4>
                                        <h5 className="text-small tracking-tight text-default-400">@tys.209</h5>
                                    </div>
                                    </div>
                                    <Button
                                    className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                                    color="secondary"
                                    radius="full"
                                    size="sm"
                                    variant={isFollowed ? "bordered" : "solid"}
                                    onPress={() => setIsFollowed(!isFollowed)}
                                    >
                                    {isFollowed ? "Unfollow" : "Follow"}
                                    </Button>
                                </CardHeader>
                                <CardBody className="px-3 py-0 text-small text-default-400">
                                    <p>
                                    Web3 developer and Web developer. Join me on this coding adventure!
                                    </p>
                                    <span className="pt-2">
                                    <Link
                                        className="text-blue-500 hover:text-blue-600"
                                        isExternal
                                        showAnchorIcon
                                        href="https://www.facebook.com/tys.209"
                                    >
                                        #vietanh209
                                    </Link>
                                    <span className="py-2" aria-label="computer" role="img">
                                        💻
                                    </span>
                                    </span>
                                </CardBody>
                                <CardFooter className="gap-3">
                                    <div className="flex gap-1">
                                    <p className="font-semibold text-default-400 text-small">4K</p>
                                    <p className=" text-default-400 text-small">Following</p>
                                    </div>
                                    <div className="flex gap-1">
                                    <p className="font-semibold text-default-400 text-small">97.1K</p>
                                    <p className="text-default-400 text-small">Followers</p>
                                    </div>
                                </CardFooter>
                            </Card>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Style.heroSection_box_right}>
                    <NextImage className={Style.responsiveImageContainer}
                    src={images.hero}
                    width={600}
                    height={600}
                    />
                </div>
            </div>
        </ThemeSwitcherText>
    </div>
    )
};

export default HeroSection;