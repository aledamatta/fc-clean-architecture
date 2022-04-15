export type NotificationErrorProps = {
   message: string;
   context: string;
}

export default class Notification {
   private errors: NotificationErrorProps[] = [];

   public addError(error: NotificationErrorProps) {
      this.errors.push(error);
   }

   public messages(context?: string): string {
      return this.errors
         .filter(error => context === undefined || error.context === context)
         .map(error => `${error.context}: ${error.message}`)
         .join(",");
   }

   public hasErrors(): boolean {
      return this.errors.length > 0;
   }

   public getErrors(): NotificationErrorProps[] {
      return this.errors;
   }
}