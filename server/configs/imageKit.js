// import ImageKit from '@imagekit/nodejs'

// var imagekit = new ImageKit({
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//     urlEndpoint: process.env.IMAGEKIT_ENDPOINT
// })

// export default imagekit

import ImageKit from '@imagekit/nodejs'

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY

// console.log("KEY EXISTS:", !!privateKey)
// console.log("KEY START:", JSON.stringify(privateKey?.slice(0, 12)))
// console.log("KEY END:", JSON.stringify(privateKey?.slice(-8)))
// console.log("KEY LENGTH:", privateKey?.length)

const imagekit = new ImageKit({
    privateKey
})

export default imagekit