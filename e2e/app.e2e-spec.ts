import { RekkitPage } from './app.po';

describe('rekkit App', function() {
  let page: RekkitPage;

  beforeEach(() => {
    page = new RekkitPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
