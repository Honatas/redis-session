import * as util from 'util';

export class Utils {
  public static inspect(data: unknown) {
    console.log(util.inspect(data, { showHidden: false, depth: null, colors: true }));
  }
}
