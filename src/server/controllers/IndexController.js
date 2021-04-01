import Controller from './Controller';
import { Readable } from 'stream';
import { load } from 'cheerio';
import { createGzip } from 'zlib';
class IndexController extends Controller {
    constructor() {
        super();
    }
    async actionIndex(ctx) {
        // throw new Error('自定义错误');
        ctx.body = "🏮首页"
    }
    async actionHome(ctx){
        const html = await ctx.render('index/pages/index');
        // console.log(html);
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
    }
}
export default IndexController;