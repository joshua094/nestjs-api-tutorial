import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../../src/auth/decorator';
import { EditBookmarkDto, createBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Get()
    getBookmark(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(':id')
    getBookmarksById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId:number) {
            return this.bookmarkService.getBookmarksById(userId, bookmarkId) 
        }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: createBookmarkDto) { 
        return this.bookmarkService.createBookmark(userId, dto) 
     }

    @Patch(':id')
    editBookmarksById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId:number, @Body() dto: EditBookmarkDto) {
        return this.bookmarkService.editBookmarksById(userId,bookmarkId, dto) 
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarksById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId:number) {
        return this.bookmarkService.deleteBookmarksById(userId, bookmarkId)
    }
}