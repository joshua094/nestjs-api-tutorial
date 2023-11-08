import { ForbiddenException, Injectable } from '@nestjs/common';
import { EditBookmarkDto, createBookmarkDto } from './dto';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) {}
    
    getBookmarks(userId: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userId,
            }
        })
    }

    
    getBookmarksById(userId: number, bookmarkId: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId,
            }
        })
    }

    
    async createBookmark(userId: number, dto: createBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto
            },
        })

        return bookmark;
      }

    
    async editBookmarksById(userId: number, bookmarkId: number,dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            }
        })
        if (!bookmark || bookmark.userId !== userId) {
            throw new ForbiddenException('Access to resource denied')
        }
        return this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
            },
            data: {
                ...dto,
            }
        })
    }

    
   async deleteBookmarksById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
        where: {
            id: bookmarkId
        }
    })
    if (!bookmark || bookmark.userId !== userId) {
        throw new ForbiddenException('Access to resource denied')
    }

    await this.prisma.bookmark.delete({
        where: {
            id: bookmarkId,
        }
    })
   }
}
