import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';

@Controller('api')
export class ApiController {
    @Post()
    addBookCase(): string {
        return "gg"
    }
}
