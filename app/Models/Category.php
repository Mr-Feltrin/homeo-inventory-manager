<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Item;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\LogsActivity;

class Category extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = ['name', 'user_id'];

    protected static function boot(): void
    {
        parent::boot();

        // Set the category's name to uppercase before saving to database
        static::creating(function ($category): void {
            $category->name = ucfirst($category->name);
        });

        // Set the category's name to uppercase before updating to database
        static::updating(function ($category): void {
            $category->name = ucfirst($category->name);
        });

        // Removes all items related to a category when the category is deleted
        static::deleting(function ($category): void {
            $category->items()->each(function ($object): void {
                $object->delete();
            });
        });
    }

    // override isdirty to log the dirty attributes
    public function isDirty($attributes = null): bool
    {
        if (is_null($attributes)) {
            $attributes = $this->getDirty();
        } else {
            $attributes = is_array($attributes) ? $attributes : func_get_args();
            $attributes = array_intersect_key($this->getDirty(), array_flip($attributes));
        }

        foreach ($attributes as $key => $value) {
            if ($key === 'name') {
                $original = $this->getOriginal($key);
                if (strcasecmp($original, $value) === 0) {
                    unset($attributes[$key]);
                }
            }
        }
        return count($attributes) > 0;
    }



    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}
