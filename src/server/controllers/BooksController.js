import Controller from './Controller';
import BooksModel from '../models/BooksModel';
import { Readable } from 'stream';
import { load } from 'cheerio';
import { createGzip } from 'zlib';

class BooksController extends Controller {
  constructor() {
    super();
  }
  async actionBooksList(ctx) {
    const booksModel = new BooksModel();
    const result = await booksModel.getBooksList();
    ctx.body = await ctx.render('books/pages/list', {
      data: [
        {
          id: 1,
          name: '图书一',
        },
        {
          id: 2,
          name: '图书二',
        },
      ],
    });
  }
  async actionBooksCreate(ctx) {
    const html = await ctx.render('books/pages/create');
    ctx.status = 200;
    ctx.type = 'html';
    //判断这个路由 到底是站内切还是直接刷新而来的
    if (ctx.request.header['x-pjax']) {
      console.log('站内切');
      const $ = load(html);
      $('.pajaxcontent').each(function () {
        ctx.res.write($(this).html());
      });
      $('.lazyload-js').each(function () {
        ctx.res.write(`<script src="${$(this).attr('src')}"></script>`);
      });
      ctx.res.end();
    } else {
      console.log('🍊站外刷');
      function createSsrStreamPromise() {
        return new Promise((resolve, reject) => {
          const htmlStream = new Readable();
          htmlStream.push(html);
          htmlStream.push(null);
          ctx.res.setHeader('content-encoding', 'gzip');
          const gz = createGzip();
          htmlStream
            .on('error', (err) => {
              reject(err);
            })
            .pipe(gz)
            .pipe(ctx.res);
        });
      }
      await createSsrStreamPromise();
    }
    // ctx.body = await ctx.render('books/pages/create');
  }
}
export default BooksController;
