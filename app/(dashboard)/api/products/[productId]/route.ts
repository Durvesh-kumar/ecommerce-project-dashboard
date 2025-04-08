import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ productId: string}>})=>{
    try {
        const productId = (await params).productId;

        if(!productId){
            return NextResponse.json({message: "Product not found", success:false, error: true}, {status: 404})
        }

        const findProduct = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!findProduct){
            return NextResponse.json({message: "Product not found", success: false, error: true}, {status: 404})
        }

        return NextResponse.json({message: "Product found", product:findProduct, success: true, error: false}, {status: 200})

    } catch (error) {
        console.log("[dashboard > api > products > productId_GET", error);
        return new NextResponse("Internal; Server Error", {status: 5000})
    }
}

export const PATCH = async (req: NextRequest, {params}: {params: Promise<{productId: string}>})=>{
    try {

        const productId = (await params).productId;

        if(!productId){
            return NextResponse.json({message: "Product not found", success: false, error: true}, {status: 404})
        }

        const secret = process.env.AUTH_SECRET!
        const token = await getToken({ req, secret }) as { collectionId?: string; isVerified?: boolean; role?: string; sub?: string } | null;
        
        if(!token){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

        if(token.role === "USER"){
            return NextResponse.json({message: "You are not authorized to update this product", success: false, error: true}, {status: 401})
        }

        if(!token.collectionId){
            return NextResponse.json({message: "Collection not found", success:false, error: true}, {status: 404})
        }

        const findProduct = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!findProduct){
            return NextResponse.json({message: "Product not found", success: false, error: true}, {status: 404})
        }

        const { title, description, price, pay, tags, sizes, colors, category, collections, ownerCollection, media, brand} = await req.json()

        // Validate required fields
        if (!title || !description || !pay || !price || !tags || !sizes || !collections || !colors || !category || !media || !brand) {
            return NextResponse.json({message:'All fields are required', error:true, success:false}, { status: 400 })
        }

        if(ownerCollection){

            if(token.role !== "OWNER" || token.collectionId !== collections){
                return NextResponse.json({message: "You are not authorized to update this product", success: false, error: true}, {status: 401});
            }

            const findCollection = await prisma.collection.findUnique({
                where:{
                    id: ownerCollection
                }
            });

            if(!findCollection){
                return NextResponse.json({message: "Collection not found", success: false, error: true}, {status: 404})
            }

            await prisma.product.update({
                where:{
                    id: productId
                },
                data:{
                    title, description, price, pay, tags, sizes, colors, category, collectionId: ownerCollection, media, brand
                }
            });

            await prisma.collection.update({
                where:{
                    id: ownerCollection
                },
                data:{
                    products:{
                        connect:{
                            id: productId
                        }
                    }
                }
            })

            if (findProduct.collectionId) {
                await prisma.collection.update({
                    where: {
                        id: findProduct.collectionId!
                    },
                    data: {
                        products: {
                            disconnect: {
                                id: productId
                            }
                        }
                    }
                });
            }

            return NextResponse.json({message: "Product updated successfully", success: true, error: false}, {status: 2000})
        }


        if(!ownerCollection){
            if(token.collectionId !== collections){
                return NextResponse.json({message: "You are not authorized to update this product", success: false, error: true}, {status: 401})
            }

            const findCollection = await prisma.collection.findUnique({
                where: {
                    id: collections
                }
            })

            if(findCollection){
                return NextResponse.json({message: "Collection not found", success: false, error: true}, {status: 404})
            }

            await prisma.product.update({
                where: {
                    id: productId
                },
                data: {
                    title, description, price, pay, tags, sizes, colors, category, media, brand
                }
            });

            return NextResponse.json({message: "Product updated successfully", success: true, error: false}, {status: 200})

        }
        
    } catch (error) {
        console.log("[dashboard > api > products > productId_PATCH", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}


export const DELETE = async (req: NextRequest, {params}:{params: Promise<{produdId: string}>})=>{
    try {

        const productId = (await params).produdId;

        if(!productId){
            return NextResponse.json({message: "Product not found", success: false, error: true}, {status: 404})
        }

        const secret = process.env.AUTH_SECRET!
        const token = await getToken({ req, secret }) as { collectionId?: string; isVerified?: boolean; role?: string; sub?: string } | null;
        
        if(!token){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

        if(token.role === "USER"){
            return NextResponse.json({message: "You are not authorized to update this product", success: false, error: true}, {status: 401})
        }

        if(!token.collectionId){
            return NextResponse.json({message: "Collection not found", success:false, error: true}, {status: 404})
        }

        const findProduct = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!findProduct){
            return NextResponse.json({message: "Product not found", success: false, error: true}, {status: 404})
        }

        if(token.role === "OWNER"){

            await prisma.collection.update({
                where: {
                    id: findProduct.collectionId!
                },
                data:{
                    products:{
                        disconnect: {
                            id: findProduct.id
                        }
                    }
                }
            });

            await prisma.product.delete({
                where: {
                    id: findProduct.id
                }
            });

            return NextResponse.json({message: "Product delete successfully", success: true, error: false}, {status: 200});
        }

        if(token.collectionId === findProduct.collectionId){

            await prisma.collection.update({
                where: {
                    id: findProduct.collectionId
                },
                data: {
                    products: {
                        disconnect:{
                            id: findProduct.id
                        }
                    }
                }
            });
            
            await prisma.product.delete({
                where: {
                    id: findProduct.id
                }
            })

            return NextResponse.json({message: "Product delete successfully", success: true, error: false}, {status: 200});
        }

        return NextResponse.json({message: "Invalid user", success: false, error: true}, {status: 404});
        
    } catch (error) {
        console.log("[dashboard > pai > products > productId_DELETE", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}