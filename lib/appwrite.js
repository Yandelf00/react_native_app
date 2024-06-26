import { Avatars, Client, Databases, Storage } from "react-native-appwrite";
import { Account } from "react-native-appwrite";
import { ID, Query } from "react-native-appwrite";

export const config = {
    endpoint : 'https://cloud.appwrite.io/v1',
    platform : 'com.yan.aora',
    projectId: '663b7eea000f53420ace',
    databaseId : '663b80dc002220ed60c1',
    userCollectionId :'663b8117000994d189f4',
    videoCollectionId: '663b8146002e7ef5fbc3',
    storageId : '663bb7a3003693bfa3ce'
}

const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client);
const storage = new Storage(client)

// Register User
export const createUser = async(email, password, username)=>{
    try{
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)
        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar:avatarUrl
            }
        ) 
        return newUser;
    }catch(error){
        console.log(error)
        throw new Error(error);
    }
} 

export async function signIn(email, password){
    try{
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    }catch(error){
        console.log(error)
        throw new Error(error);
    }
}

export const getCurrentUser = async()=>{
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    }catch(error){
        console.log(error)
    }
}

export const getAllPosts = async()=>{
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        )
        return posts.documents
    }catch(error){
        throw new Error(error);
    }
}

export const getLatestsPosts = async()=>{
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents
    }catch(error){
        throw new Error(error);
    }
}

export const searchPosts= async(query)=>{
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', query)]
        )
        return posts.documents
    }catch(error){
        throw new Error(error);
    }
}

export const getUserPosts= async(userId)=>{
    try{
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal('creator', userId)]
        )
        return posts.documents
    }catch(error){
        throw new Error(error);
    }
}

export const signOut = async()=>{
    try{
        const session = await account.deleteSession('current')
        return session;
    }catch(error){
        throw new Error(error);
    }
}



export const getFilePreview = async(fileId, type)=>{
    let fileUrl
    try {
       if (type === 'video'){
        fileUrl = storage.getFileView(config.storageId, fileId)
      } else if(type === 'image'){
        fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top', 100)
      }else {
        throw new Error('invalid file type')
      } 
      if (!fileUrl) throw Error;
      return fileUrl;

    } catch (error) {
       throw new Error(erro) 
    }
}


export const uploadFile = async(file, type)=>{
    if(!file) return

    const {mimeType, ...rest} = file;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    };

    try{
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );
        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        return fileUrl
    }catch(error){
        throw new Error(error)
    }
}

export const createVideo = async(form)=>{
    try{
        const [thumbnailUrl, videoUrl]=await Promise.all([
            uploadFile(form.thumbnailUrl,'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(
            config.databaseId, config.videoCollectionId, ID.unique(), {
                title: form.title,
                thumbnail : thumbnailUrl,
                video : videoUrl,
                prompt : form.prompt,
                creator : form.userId
            }
        )
    }catch(error){
        throw new Error(error)
    }
}
