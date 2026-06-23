import fs from 'node:fs';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const readableStream = fs.createReadStream('users.csv', { encoding: 'utf8' });
const writableStream = fs.createWriteStream('users-clean.csv');

class CsvCleaner extends Transform {
    constructor(column, options) {
        super(options);
        this.tail = '';
        this.headers = '';
        this.column = column;
        this.lineRead = 0;
        this.lineWrited = 0;
        this.filtered = 0;
    }

    _transform(chunk, encoding, callback) {
        const lines = (this.tail + chunk.toString('utf8')).split(/\r?\n/)
        this.tail = lines.pop();

        for (const line of lines) {
            this.lineRead++
            if (!this.headers) {
                this.headers = line.split(',');
            }

            const values = line.split(',');

            const columnIndex = this.headers.indexOf(this.column.toLowerCase());
            const activeIndex = this.headers.indexOf('active');

            if (columnIndex === -1 || activeIndex === -1) continue;

            if (values[activeIndex] === 'true') {
                values[columnIndex] = values[columnIndex].toUpperCase();
                this.push(values.join(',') + '\n');

                this.lineWrited++;
                this.filtered++;
            }
        }

        callback();
    }

    _flush(callback) {
        if (this.tail) this.tail = '';
        callback();
    }
}

const csvCleaner = new CsvCleaner('COUNTRY');
await pipeline(
    readableStream,
    csvCleaner,
    writableStream)
