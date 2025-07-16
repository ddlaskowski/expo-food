import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.lc.expofood",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: '686facc9002804bf821d',
    bucketId: '68768c91002b34b9b8ca',
    userCollectionId: '686fc58d001a91658a25',
    categoriesCollectionId: '687688540015d59cc067',
    menuCollectionId: '68768972000407b9c28f',
    customizationsCollectionId: '68768a700021ffdb1544',
    menuCustomizationCollectionId: '68768b190033232bca7f',

}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);
export const storage = new Storage(client);

export const createUser = async ({email, password, name}: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;
        await signIn({email, password});
        const avatarUrl = avatars.getInitialsURL(name)

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId, 
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email,
                name,
                accountId: newAccount.$id,
                avatar: avatarUrl
            }
        )
        return newUser;
    }
    catch (e)
    {
        throw new Error(e as string);
    }
}

export const signIn = async({email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    }
    catch (e)
    {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async() => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    }
    catch (e)
    {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({category, query}: GetMenuParams) => {
    try {
        const queries: string[] = [];
        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )
        return menus.documents;
    }
    catch (e) {
        throw new Error(e as string)
    }
}

export const getCategories = async() => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )
        return categories.documents;
    }
    catch (e)
    {
        throw new Error(e as string);
    }
}