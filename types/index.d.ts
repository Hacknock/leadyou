declare module "*.md";
declare module "*.png";
declare module "*.jpg";
declare module "*.gif";
declare module "*.json" {
  const data: any;
  export default data;
}
